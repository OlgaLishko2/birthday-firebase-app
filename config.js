import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBDCDRRiyYAKF4ZLSuBajaUO0qfDTi3jbQ",
  authDomain: "birthdayapp-62b17.firebaseapp.com",
  projectId: "birthdayapp-62b17",
  storageBucket: "birthdayapp-62b17.firebasestorage.app",
  messagingSenderId: "276618352326",
  appId: "1:276618352326:web:c7fe9f085675619d17e9c7",
  measurementId: "G-1939RLV2DJ",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
