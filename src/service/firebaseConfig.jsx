import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, setPersistence, browserLocalPersistence } from "firebase/auth";

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
export const auth = getAuth(app);

// Set persistence to LOCAL so user stays logged in
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Auth persistence set to LOCAL");
  })
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Auth functions with better error handling
export const signInWithGoogle = async () => {
  try {
    console.log("Starting Google Sign-In...");
    const result = await signInWithPopup(auth, googleProvider);
    console.log("Sign-in successful:", result.user);
    return result.user;
  } catch (error) {
    console.error("Detailed sign-in error:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    
    // Handle specific error cases
    if (error.code === 'auth/popup-blocked') {
      throw new Error("Pop-up was blocked by your browser. Please allow pop-ups for this site and try again.");
    } else if (error.code === 'auth/unauthorized-domain') {
      throw new Error("This domain is not authorized. Please add it to Firebase Console > Authentication > Settings.");
    } else if (error.code === 'auth/operation-not-allowed') {
      throw new Error("Google Sign-In is not enabled. Please enable it in Firebase Console.");
    } else if (error.code === 'auth/network-request-failed') {
      throw new Error("Network error. Please check your internet connection.");
    }
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    console.log("User signed out successfully");
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};