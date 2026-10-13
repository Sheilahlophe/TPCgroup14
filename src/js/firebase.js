import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

// Add the Firebase web app settings for this project here.
const firebaseConfig = {
  apiKey: "AIzaSyAEUsNsqsqqylyokGkBFQOTxc3qPNeephc",
  authDomain: "learnerdb.firebaseapp.com",
  databaseURL: "https://learnerdb-default-rtdb.firebaseio.com",
  projectId: "learnerdb",
  storageBucket: "learnerdb.firebasestorage.app",
  messagingSenderId: "135342650161",
  appId: "1:135342650161:web:1994714e191206ea41f610",
  measurementId: "G-BZ3671KDQ1"
};

// Do not start Firebase until every required setting has a value.
export const firebaseConfigured = Object.values(firebaseConfig)
  .every(value => typeof value === "string" && value.trim() !== "");

let auth = null;
let db = null;

// Create the Firebase app and services when its settings are ready.
if (firebaseConfigured) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getDatabase(app);
}

// Share these services with the other JavaScript modules.
export { auth, db };
