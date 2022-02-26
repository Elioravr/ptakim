// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set, push, get, remove } from "firebase/database";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
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
auth.languageCode = 'he';
console.log('auth', auth);

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
    remove(ref(db, `peteks/${petekId}`));
}

export const createUserWithPhoneNumber = () => {
    const appVerifier = window.recaptchaVerifier;

    const auth = getAuth();
    signInWithPhoneNumber(auth, '+972545405558', appVerifier)
        .then((confirmationResult) => {
            console.log('confirmationResult', confirmationResult);
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

console.log('RecaptchaVerifier', RecaptchaVerifier);

window.recaptchaVerifier = new RecaptchaVerifier('sign-in-button', {
  'size': 'invisible',
  'callback': (response) => {
    // reCAPTCHA solved, allow signInWithPhoneNumber.
    console.log('blahhhhh');
  }
}, auth);
// window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {}, auth);
// const recaptchaVerifier = new RecaptchaVerifier('recaptcha-container');
// console.log('recaptchaVerifier', recaptchaVerifier);
// window.recaptchaVerifier = recaptchaVerifier;
