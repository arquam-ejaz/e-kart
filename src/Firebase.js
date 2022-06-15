// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBGfSVhDMM9eJwco7sce8S6S5N6VCGLS_U",
  authDomain: "e-kart-19d3c.firebaseapp.com",
  projectId: "e-kart-19d3c",
  storageBucket: "e-kart-19d3c.appspot.com",
  messagingSenderId: "21215439058",
  appId: "1:21215439058:web:0b9f9ae62096d31f07e50b",
  measurementId: "G-LMEQ8GLS1F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth  = getAuth(app);
const db = getFirestore(app);

export { auth, db }