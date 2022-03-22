import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

if (!getApps().length)
  initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });

const firestore = getFirestore();

export default firestore;
