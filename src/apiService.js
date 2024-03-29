// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getDatabase, ref, set, push, get, remove} from 'firebase/database';
import {
  getStorage,
  ref as refForStorage,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
} from 'firebase/auth';
import {getMessaging} from 'firebase/messaging';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDaBFPa0M5fMCw-WmSYBknzwvdMsPRW6B0',
  authDomain: 'ptakim-4f594.firebaseapp.com',
  databaseURL: 'https://ptakim-4f594-default-rtdb.firebaseio.com',
  projectId: 'ptakim-4f594',
  storageBucket: 'ptakim-4f594.appspot.com',
  messagingSenderId: '128907605631',
  appId: '1:128907605631:web:649107193a674f065d314a',
  measurementId: 'G-0RSF6Q2FEX',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const storage = getStorage();

const auth = getAuth();
const recaptchaVerifier = new RecaptchaVerifier(
  'sign-in-button',
  {
    size: 'invisible',
    callback: () => {
      // reCAPTCHA solved, allow signInWithPhoneNumber.
    },
  },
  auth,
);

auth.languageCode = 'he';

const messaging = getMessaging();

navigator.serviceWorker.register('./firebase-message-sw.js').then(
  function (registration) {
    // Registration was successful
    console.log(
      'firebase-message-sw :ServiceWorker registration successful with scope: ',
      registration.scope,
    );
    messaging.useServiceWorker(registration);
  },
  function (err) {
    // registration failed :(
    console.log(
      'firebase-message-sw: ServiceWorker registration failed: ',
      err,
    );
  },
);
function requestPermission() {
  console.log('Requesting permission...');
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');
    } else {
      console.log('Notification permission denied.');
    }
  });
}

requestPermission();
// getToken(
//   messaging,
//   'BBQhTsEjC-MEKQ098ERpix-smOvSMBITBSdopupTpe9pZ4F5TajnwfpCCpjblfRLbkmhcSzSbI_3KO1F1lv_K40',
// )
//   .then(() => {
//     console.log('success!');
//   })
//   .catch((e) => console.log('messaging e', e));
//   .then(function (currentToken) {
//     if (currentToken) {
//       console.log('Got token:', currentToken);
//       return set(
//         ref(db, `users/${getCurrentUser().uid}/tokens/${currentToken}`),
//         true,
//       )
//         // .then(() => {
//         //   console.log('Subscribed to topic');
//         // })
//         .then(() => {
//           return subscribeToTopic('GENERAL_NOTIFICATIONS');
//         })
//         .catch((error) => {
//           console.log('Error subscribing to topic:', error);
//         });
//     } else {
//       console.log('No token available');
//     }
//   })
//   .catch(function (err) {
//     console.log('An error occurred while retrieving token. ', err);
//   });

export const fetchPetekList = async () => {
  const peteksSnap = await get(ref(db, 'peteks/'));
  const petekList = await peteksSnap.val();
  const commentsPerPetekSnap = await get(ref(db, `comments`));
  const commentsPerPetek = await commentsPerPetekSnap.val();

  const peteks = await Promise.all(
    Object.keys(petekList).map(async (petekId) => {
      if (commentsPerPetek[petekId] == null) {
        return {
          id: petekId,
          ...petekList[petekId],
          comments: [],
        };
      }

      const commentsWithUsers = await Promise.all(
        Object.keys(commentsPerPetek[petekId])?.map(async (commentId) => {
          const currentComment = commentsPerPetek[petekId][commentId];
          const userSnap = await get(ref(db, `users/${currentComment.userId}`));
          const user = await userSnap.val();
          const userNicknameByPhoneNumberSnap = await get(
            ref(db, `usersMappedToPhoneNumber/${user.phoneNumber}`),
          );

          const userNicknameByPhoneNumber =
            await userNicknameByPhoneNumberSnap.val();

          return {
            ...currentComment,
            user: {
              ...user,
              nickname: userNicknameByPhoneNumber,
              commenterFullName: user.name,
            },
          };
        }),
      );

      return {
        id: petekId,
        ...petekList[petekId],
        comments: commentsWithUsers,
      };
    }),
  );

  return peteks;
};

export const fetchOwnerPics = () => {
  return get(ref(db, 'ownerPics/')).then((snap) => {
    return snap.val();
  });
};

export const fetchCurrentUser = () => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return Promise.resolve(null);
  }

  const userPromises = Promise.all([
    get(ref(db, `users/${currentUser.uid}`)),
    get(ref(db, `usersMappedToPhoneNumber/${currentUser.phoneNumber}`)),
  ]);

  return userPromises
    .then(([snapForUser, snapForOwnerName]) => {
      return Promise.all([snapForUser.val(), snapForOwnerName.val()]);
    })
    .then(([currentUser, ownerName]) => {
      return {...currentUser, ownerName};
    });
};

export const addNewPetek = async (petek) => {
  if (petek.id) {
    return set(ref(db, `peteks/${petek.id}`), petek);
  }

  return push(ref(db, 'peteks/'), petek).then((data) => {
    return addNotification(
      petek.owner,
      data.key,
      `נוסף פתק חדש ל${petek.owner}`,
      // eslint-disable-next-line no-console
    ).catch((e) => console.log('Notification not created', e));
  });
};

export const deletePetek = (petekId) => {
  return remove(ref(db, `peteks/${petekId}`));
};

export const createUser = async (id, phoneNumber, name) => {
  try {
    await set(ref(db, `users/${id}`), {id, name, phoneNumber});
    const ownerNameSnap = await get(
      ref(db, `usersMappedToPhoneNumber/${phoneNumber}`),
    );
    const ownerName = await ownerNameSnap.val();
    return set(ref(db, `usersMappedToPhoneNumber/${id}`), ownerName);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
};

export const addComment = (petek, content) => {
  const currentUser = getCurrentUser();
  const newCommentCollection = [
    ...(petek.comments ?? []),
    {
      petekId: petek.id,
      content,
      createdAt: new Date().toISOString(),
      userId: currentUser.uid,
    },
  ];

  return set(ref(db, `comments/${petek.id}`), newCommentCollection).then(
    async () => {
      const ownerNameSnap = await get(
        ref(db, `usersMappedToPhoneNumber/${currentUser.phoneNumber}`),
      );
      const ownerName = await ownerNameSnap.val();
      const userFullNameSnap = await get(
        ref(db, `users/${currentUser.uid}/name`),
      );
      const userFullName = await userFullNameSnap.val();

      const nameForNotification = ownerName || userFullName;

      return addNotification(
        nameForNotification,
        petek.id,
        `${nameForNotification} הגיב/ה על הפתק של ${petek.owner}`,
        // eslint-disable-next-line no-console
      ).catch((e) => console.log('Notification not created', e));
    },
  );
};

export const addNotification = (ownerId, petekId, content) => {
  return push(ref(db, 'notifications/'), {
    ownerId,
    petekId,
    content,
    createdAt: new Date().toISOString(),
  });
};

export const fetchNotifications = async () => {
  const notificationsCollectionSnap = await get(ref(db, 'notifications/'));
  const notificationsCollection = await notificationsCollectionSnap.val();
  const notificationsArray = await Promise.all(
    Object.keys(notificationsCollection).map(async (notificationKey) => {
      const currentNotification = notificationsCollection[notificationKey];

      return {
        ...currentNotification,
        ownerName: currentNotification.ownerId,
      };
    }),
  );

  return notificationsArray;
};

export const uploadUserPhoto = (file, ownerName, refetchOwnerPics) => {
  if (!file) {
    return;
  }

  const imagesRef = refForStorage(
    storage,
    `userImage-${new Date().toISOString()}`,
  );

  const uploadTask = uploadBytesResumable(imagesRef, file);

  uploadTask.on(
    'state_changed',
    () => {
      // (snapshot) => {
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      // let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      // setProgress(parseInt(progress));
    },
    (e) => {
      // eslint-disable-next-line no-console
      console.log(e);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        // setImageURL(downloadURL);
        // setProgress(null);
        return (
          set(ref(db, `ownerPics/${ownerName}`), downloadURL)
            // .then((snap) => {
            //   return snap.val();
            // })
            .then(refetchOwnerPics)
        );
      });
    },
  );
};

export const uploadPhoto = (file, setProgress, setImageURL) => {
  if (!file) {
    return;
  }

  const imagesRef = refForStorage(
    storage,
    `petekImages-${new Date().toISOString()}`,
  );

  const uploadTask = uploadBytesResumable(imagesRef, file);

  uploadTask.on(
    'state_changed',
    (snapshot) => {
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setProgress(parseInt(progress));
    },
    (e) => {
      // eslint-disable-next-line no-console
      console.log(e);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        setImageURL(downloadURL);
        setProgress(null);
      });
    },
  );
};

export const fetchUsersMappedToPhoneNumber = async () => {
  const phoneNumberCollectionSnap = await get(
    ref(db, 'usersMappedToPhoneNumber/'),
  );
  const phoneNumberCollection = await phoneNumberCollectionSnap.val();

  return phoneNumberCollection;
};

export const setPhoneNumberForUser = async (ownerName, phoneNumber) => {
  return set(ref(db, `usersMappedToPhoneNumber/${phoneNumber}`), ownerName);
};

export const createUserWithPhoneNumber = (phoneNumber) => {
  const appVerifier = recaptchaVerifier;

  const auth = getAuth();
  return signInWithPhoneNumber(auth, `+972${phoneNumber}`, appVerifier)
    .then((confirmationResult) => {
      // SMS sent. Prompt user to type the code from the message, then sign the
      // user in with confirmationResult.confirm(code).
      window.confirmationResult = confirmationResult;
      // ...
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log('error', error);
      // Error; SMS not sent
      // ...
    });
};

export const verifyCode = (code, name) => {
  return window.confirmationResult.confirm(code).then((result) => {
    // User signed in successfully.
    const user = result.user;
    return createUser(user.uid, user.phoneNumber, name);
    // return user
    // ...
  });
};

export const logout = () => {
  return signOut(auth)
    .then(() => {
      // Sign-out successful.
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log('error', error);
    });
};

export const getCurrentUser = () => {
  const user = auth.currentUser;
  return user;
};

export const fetchGateKeepers = async () => {
  const gateKeepersSnap = await get(ref(db, 'GateKeepers/'));
  const gateKeepers = await gateKeepersSnap.val();

  window.gateKeepers = gateKeepers;

  // Overriding GKs
  // window.gateKeepers = {
  //   enableUserRating: true,
  // };
};
