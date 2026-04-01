// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBftnwXC8q3wC0DXRzxZRuamJaA5XUxg2A",
  authDomain: "ai-travel-planner-26c8e.firebaseapp.com",
  projectId: "ai-travel-planner-26c8e",
  storageBucket: "ai-travel-planner-26c8e.firebasestorage.app",
  messagingSenderId: "439065031059",
  appId: "1:439065031059:web:663d69680f0a213ed0f866",
  measurementId: "G-34JXTHJZ9D"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
