// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwVJv0Dl58DYT_xzq9bOCOb0nwvJEc7ME",
  authDomain: "telemedecin.firebaseapp.com",
  projectId: "telemedecin",
  storageBucket: "telemedecin.appspot.com",
  messagingSenderId: "413802716106",
  appId: "1:413802716106:web:31b4a82b9b9157c9d5cd33",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get the Auth instance
const auth = getAuth(app);

export { auth };
