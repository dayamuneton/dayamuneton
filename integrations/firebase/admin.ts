import { cert, getApps, initializeApp, type ServiceAccount } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { isLocalSite, localFirebase } from "@/config/site-environment";

function serverApp() {
   if (typeof window !== "undefined") throw new Error("Firebase Admin requires the server.");
   const name = "portfolio-server";
   const existing = getApps().find((app) => app.name === name);
   if (existing) return existing;

   if (isLocalSite) {
      process.env.FIRESTORE_EMULATOR_HOST = `${localFirebase.host}:${localFirebase.firestorePort}`;
      process.env.FIREBASE_AUTH_EMULATOR_HOST = `${localFirebase.host}:${localFirebase.authPort}`;
      return initializeApp({ projectId: localFirebase.projectId }, name);
   }

   const value = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
   if (!value) throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is required.");
   const account: unknown = JSON.parse(value);
   if (!account || typeof account !== "object" ||
       !("project_id" in account) || account.project_id !== process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
       !("client_email" in account) || typeof account.client_email !== "string" ||
       !("private_key" in account) || typeof account.private_key !== "string") {
      throw new Error("The server credential must belong to the configured Firebase project.");
   }
   return initializeApp({ credential: cert(account as ServiceAccount) }, name);
}

export function serverDb() {
   return getFirestore(serverApp());
}

export function serverAuth() {
   return getAuth(serverApp());
}
