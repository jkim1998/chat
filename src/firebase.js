import firebase, { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
import "firebase/firestore";
import "firebase/auth";
import "firebase/analytics";
import "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyB07a-2Jyesie2SqseZOS8idl3aKN5FgDg",
  authDomain: "fooddelivery-e9737.firebaseapp.com",
  databaseURL: "https://fooddelivery-e9737-default-rtdb.firebaseio.com",
  projectId: "fooddelivery-e9737",
  storageBucket: "fooddelivery-e9737.appspot.com",
  messagingSenderId: "126455582870",
  appId: "1:126455582870:web:5b69040a32b03dc88bf2b7",
};

const app = initializeApp(firebaseConfig);

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();
