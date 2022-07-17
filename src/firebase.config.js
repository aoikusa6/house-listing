// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAPWXEE7aPDCkr2Uj-mul6N-QRuHFvzx1I',
  authDomain: 'house-listing-app-18363.firebaseapp.com',
  projectId: 'house-listing-app-18363',
  storageBucket: 'house-listing-app-18363.appspot.com',
  messagingSenderId: '197279075636',
  appId: '1:197279075636:web:117745f97a2d6fcdeae961',
  measurementId: 'G-ZXJYCDNMT9',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore()