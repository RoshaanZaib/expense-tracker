import { getApp, getApps, initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyACf_Q2M3lh3w7Fq5K2C9ku64IsHCfhArE",
  authDomain: "expense-tracker-c7acc.firebaseapp.com",
  projectId: "expense-tracker-c7acc",
  storageBucket: "expense-tracker-c7acc.firebasestorage.app",
  messagingSenderId: "365823667886",
  appId: "1:365823667886:web:9a466eba4b381e7171c73f"
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export default app