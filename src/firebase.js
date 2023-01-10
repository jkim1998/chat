// Import the functions you need from the SDKs you need
import firesbase, { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1xXAWD57Q93x24TQSqcxh7Q9NxShKyfA",
  authDomain: "chat-67d18.firebaseapp.com",
  projectId: "chat-67d18",
  storageBucket: "chat-67d18.appspot.com",
  messagingSenderId: "341687704992",
  appId: "1:341687704992:web:a5e90bb378ec19f7ab58c5",
  measurementId: "G-HB3E4QHJ7N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = app.auth();