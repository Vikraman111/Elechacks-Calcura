// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCAPJhF8qUqY-SYbK9VtLdHaBCEZ0KRzGI",
  authDomain: "all-in-one-calculator-bc861.firebaseapp.com",
  projectId: "all-in-one-calculator-bc861",
  storageBucket: "all-in-one-calculator-bc861.appspot.com",
  messagingSenderId: "213200826064",
  appId: "1:213200826064:web:5fc8e8455fc56f56aeb8d5",
  measurementId: "G-H5HRCKNF6Z"
};

// Initialize Firebase
export const app = firebase.initializeApp(firebaseConfig);
export const db=firebase.firestore();