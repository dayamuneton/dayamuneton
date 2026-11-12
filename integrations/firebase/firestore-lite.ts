import { connectFirestoreEmulator, getFirestore } from "firebase/firestore/lite";
import { localFirebase } from "@/config/site-environment";
import { app, connectLocalEmulator } from "./app";

export const db = getFirestore(app);

connectLocalEmulator("firestore-lite", () => {
   connectFirestoreEmulator(db, localFirebase.host, localFirebase.firestorePort);
});
