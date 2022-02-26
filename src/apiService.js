// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set, push, get, remove } from "firebase/database";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, signOut } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDaBFPa0M5fMCw-WmSYBknzwvdMsPRW6B0",
  authDomain: "ptakim-4f594.firebaseapp.com",
  databaseURL: "https://ptakim-4f594-default-rtdb.firebaseio.com",
  projectId: "ptakim-4f594",
  storageBucket: "ptakim-4f594.appspot.com",
  messagingSenderId: "128907605631",
  appId: "1:128907605631:web:649107193a674f065d314a",
  measurementId: "G-0RSF6Q2FEX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

const auth = getAuth();
const recaptchaVerifier = new RecaptchaVerifier('sign-in-button', {
  'size': 'invisible',
  'callback': (response) => {
    // reCAPTCHA solved, allow signInWithPhoneNumber.
  }
}, auth);

auth.languageCode = 'he';
// let confirmationResult = null;

export const fetchPetekList = () => {
    return get(ref(db, 'peteks/')).then(snap => {
        return snap.val();
    });
}

export const addNewPetek = async (petek) => {
    if (petek.id) {
        return set(ref(db, `peteks/${petek.id}`), petek);
    }

    return push(ref(db, 'peteks/'), petek);
}

export const deletePetek = (petekId) => {
    return remove(ref(db, `peteks/${petekId}`));
}

export const createUserWithPhoneNumber = (phoneNumber) => {
    const appVerifier = recaptchaVerifier;

    const auth = getAuth();
    return signInWithPhoneNumber(auth, `+972${phoneNumber}`, appVerifier)
        .then((confirmationResult) => {
            // SMS sent. Prompt user to type the code from the message, then sign the
            // user in with confirmationResult.confirm(code).
            window.confirmationResult = confirmationResult;
            // ...
        }).catch((error) => {
            console.log('error', error);
            // Error; SMS not sent
            // ...
        });
}

export const verifyCode = (code) => {
    return window.confirmationResult.confirm(code).then((result) => {
        // User signed in successfully.
        const user = result.user;
        return user
        // ...
    });
}

export const logout = () => {
    return signOut(auth).then(() => {
        // Sign-out successful.
    }).catch((error) => {
        console.log('error', error);
    });
}

export const getCurrentUser = () => {
    const user = auth.currentUser;
    return user;
}
