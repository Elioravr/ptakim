// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set, push, get, remove } from "firebase/database";
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

export const fetchPetekList = () => {
    return get(ref(db, 'peteks/')).then(snap => {
        return snap.val();
    });
}

export const addNewPetek = async (petek) => {
    if (petek.id) {
        console.log('petek', petek);
        return set(ref(db, `peteks/${petek.id}`), petek);
    }

    return push(ref(db, 'peteks/'), petek);
}

export const deletePetek = (petekId) => {
    remove(ref(db, `peteks/${petekId}`));
}
