import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
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

const registry = globalThis as typeof globalThis & {
   dayaEmulators?: WeakMap<FirebaseApp, Set<string>>;
};

export function connectLocalEmulator(service: string, connect: () => void) {
   if (!isLocalSite) return;
   const instances = registry.dayaEmulators ??= new WeakMap();
   const services = instances.get(app) ?? new Set<string>();
   if (services.has(service)) return;
   connect();
   services.add(service);
   instances.set(app, services);
}
