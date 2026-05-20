import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCfOxWYSq_uTJIN4uBkaKzMtcVaP40aACA",
    authDomain: "digital-khata-7a4e3.firebaseapp.com",
    projectId: "digital-khata-7a4e3",
    storageBucket: "digital-khata-7a4e3.firebasestorage.app",
    messagingSenderId: "496696060499",
    appId: "1:496696060499:web:5b9b4e778f6a36666ab4a6",
};

const app = !getApps().length
    ? initializeApp(firebaseConfig)
    : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);