import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyD7Asu8EGG1yZMe-q95lvVLr_Xbf3DB2xM",
  authDomain: "zenscribbe.firebaseapp.com",
  projectId: "zenscribbe",
  storageBucket: "zenscribbe.appspot.com",
  messagingSenderId: "391841256546",
  appId: "1:391841256546:web:6a4a69aba07c4550be6d3b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const notesCollection = collection(db, "zenscribe")