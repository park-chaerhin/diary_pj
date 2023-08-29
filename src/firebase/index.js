import React from 'react';
import firebase from 'firebase/compat/app';

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAtVktwW81ymAkR2anamaGyje9BF1-QTYY",
    authDomain: "capturenote-54bc2.firebaseapp.com",
    databaseURL: "https://capturenote-54bc2-default-rtdb.firebaseio.com",
    projectId: "capturenote-54bc2",
    storageBucket: "capturenote-54bc2.appspot.com",
    messagingSenderId: "1004451932995",
    appId: "1:1004451932995:web:189c8b0d75c3324af49df6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// firestore database
export const db = getFirestore(app);

// firebase db객체 연결
const oDB = getDatabase(app);

// firebase storage 객체 공개
export const oStorage = getStorage(app);
