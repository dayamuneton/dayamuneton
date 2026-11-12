import { getApps, initializeApp } from "firebase/app";
import { browserLocalPersistence, connectAuthEmulator, getAuth, GoogleAuthProvider, initializeAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import { isLocalSite, localFirebase } from "@/config/site-environment";

const firebaseConfig = isLocalSite ? {
   apiKey: "demo-api-key",
   projectId: localFirebase.projectId,
   storageBucket: `${localFirebase.projectId}.appspot.com`,
} : {
   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const appName = isLocalSite ? localFirebase.projectId : "[DEFAULT]";
const existingApp = getApps().find((app) => app.name === appName);
export const app = existingApp ?? initializeApp(firebaseConfig, appName);
export const auth = isLocalSite && !existingApp
   ? initializeAuth(app, { persistence: browserLocalPersistence })
   : getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

if (isLocalSite && !existingApp) {
   const { host, authPort, firestorePort, storagePort } = localFirebase;
   connectAuthEmulator(auth, `http://${host}:${authPort}`, { disableWarnings: true });
   connectFirestoreEmulator(db, host, firestorePort);
   connectStorageEmulator(storage, host, storagePort);
}
