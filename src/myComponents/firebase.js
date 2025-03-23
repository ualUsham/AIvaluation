import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGs2xnxF9Sgo6xTMsl5diAvKvRoJveGhU",
  authDomain: "aivaluation-2656.firebaseapp.com",
  projectId: "aivaluation-2656",
  storageBucket: "aivaluation-2656.firebasestorage.app",
  messagingSenderId: "335298344102",
  appId: "1:335298344102:web:0c56d6b5adf15ef748b067"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
export const auth=getAuth();
export const db=getFirestore(app)



