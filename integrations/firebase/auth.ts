import { browserLocalPersistence, connectAuthEmulator, getAuth, GoogleAuthProvider, initializeAuth } from "firebase/auth";
import { isLocalSite, localFirebase } from "@/config/site-environment";
import { app, connectLocalEmulator } from "./app";

export const auth = isLocalSite ? initializeAuth(app, { persistence: browserLocalPersistence }) : getAuth(app);
export const googleProvider = new GoogleAuthProvider();

connectLocalEmulator("auth", () => {
   connectAuthEmulator(auth, `http://${localFirebase.host}:${localFirebase.authPort}`, { disableWarnings: true });
});
