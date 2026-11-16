import { connectStorageEmulator, getStorage } from "firebase/storage";
import { localFirebase } from "@/config/site-environment";
import { app, connectLocalEmulator } from "./app";

export const storage = getStorage(app);

connectLocalEmulator("storage", () => {
   connectStorageEmulator(storage, localFirebase.host, localFirebase.storagePort);
});
