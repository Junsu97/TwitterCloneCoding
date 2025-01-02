// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCDQaqjDH_piLmIIH4UD_vfGwIkJ5pUGZE",
    authDomain: "twitter-clonecoding-a5e69.firebaseapp.com",
    projectId: "twitter-clonecoding-a5e69",
    storageBucket: "twitter-clonecoding-a5e69.firebasestorage.app",
    messagingSenderId: "299402040516",
    appId: "1:299402040516:web:90258b0132aca045eee591"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);