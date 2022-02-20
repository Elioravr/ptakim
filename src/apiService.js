// import * as firebase from 'firebase';
import { initializeApp } from 'firebase/app';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDaBFPa0M5fMCw-WmSYBknzwvdMsPRW6B0",
  authDomain: "ptakim-4f594.firebaseapp.com",
  projectId: "ptakim-4f594",
  storageBucket: "ptakim-4f594.appspot.com",
  messagingSenderId: "128907605631",
  appId: "1:128907605631:web:649107193a674f065d314a",
  measurementId: "G-0RSF6Q2FEX"
};

// Initialize Firebase
const x = initializeApp(firebaseConfig);

export const fetchPetekList = () => {
    console.log('blah');
}
