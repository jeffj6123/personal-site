// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA8SFRnA1gfSLmS5PVZ0F96YBvmpQqUnuA",
  authDomain: "jeffjarry-personal-site.firebaseapp.com",
  projectId: "jeffjarry-personal-site",
  storageBucket: "jeffjarry-personal-site.appspot.com",
  messagingSenderId: "1028785170930",
  appId: "1:1028785170930:web:5cea44ad2d0609df55e36b",
  measurementId: "G-S33DV97778"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);