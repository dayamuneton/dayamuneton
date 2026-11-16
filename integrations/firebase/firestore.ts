import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { localFirebase } from "@/config/site-environment";
import { app, connectLocalEmulator } from "./app";

export const db = getFirestore(app);

connectLocalEmulator("firestore", () => {
   connectFirestoreEmulator(db, localFirebase.host, localFirebase.firestorePort);
});
