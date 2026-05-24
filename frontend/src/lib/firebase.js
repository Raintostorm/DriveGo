import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export function isFirebaseConfigured() {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)
}

let app = null

function getApp() {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase chưa cấu hình (VITE_FIREBASE_* trong frontend/.env)")
  }
  if (!app) {
    app = initializeApp(firebaseConfig)
  }
  return app
}

export async function signInWithGooglePopup() {
  const auth = getAuth(getApp())
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: "select_account" })
  const result = await signInWithPopup(auth, provider)
  return result.user.getIdToken()
}
