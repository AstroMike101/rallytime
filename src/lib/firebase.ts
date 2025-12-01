// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported as analyticsIsSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkNj3ncLatfNrDkELofTMAaGFV7D8duP0",
  authDomain: "rallytime-d9c75.firebaseapp.com",
  projectId: "rallytime-d9c75",
  storageBucket: "rallytime-d9c75.firebasestorage.app",
  messagingSenderId: "599626208244",
  appId: "1:599626208244:web:d09d19ae9a71c40dc8dfa1",
  measurementId: "G-CBTF77ZJH8",
};

const app = initializeApp(firebaseConfig);

let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== "undefined") {
  analyticsIsSupported().then((supported) => {
    if (supported) analytics = getAnalytics(app);
  });
}

export const db = getFirestore(app);
export const auth = getAuth(app);
