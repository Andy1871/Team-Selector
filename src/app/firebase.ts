// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC8ufrQvZMGjO1wHppKdHAh_JFPyTpenwI",
  authDomain: "squad-picker-4c2a2.firebaseapp.com",
  projectId: "squad-picker-4c2a2",
  storageBucket: "squad-picker-4c2a2.firebasestorage.app",
  messagingSenderId: "744096993747",
  appId: "1:744096993747:web:f3920ff3bded5992cadf26",
  measurementId: "G-9ZZ2LH7675"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)