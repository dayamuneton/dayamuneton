import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "firebase/auth";

interface AuthContextValue {
   currentUser: User | null;
   authReady: boolean;
   loginWithGoogle: () => Promise<unknown>;
   signUpUserWithEmailAndPassword: (email: string, password: string, name: string) => Promise<string | undefined>;
   signInWithEmail: (email: string, password: string) => Promise<string | undefined>;
   logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
   const value = useContext(AuthContext);
   if (!value) throw new Error("useAuth requires AuthProvider");
   return value;
}

async function loadAuth() {
   const [sdk, { auth, googleProvider }] = await Promise.all([
      import("firebase/auth"),
      import("@/integrations/firebase/auth"),
   ]);
   return { sdk, auth, googleProvider };
}

async function loginWithGoogle() {
   try {
      const { sdk, auth, googleProvider } = await loadAuth();
      await sdk.signInWithPopup(auth, googleProvider, sdk.browserPopupRedirectResolver);
   } catch (error) {
      return error;
   }
}

async function signUpUserWithEmailAndPassword(email: string, password: string, name: string) {
   try {
      const { sdk, auth } = await loadAuth();
      const { user } = await sdk.createUserWithEmailAndPassword(auth, email, password);
      await sdk.updateProfile(user, { displayName: name });
   } catch (error) {
      return error instanceof Error ? error.message : "Could not create your account.";
   }
}

async function signInWithEmail(email: string, password: string) {
   try {
      const { sdk, auth } = await loadAuth();
      await sdk.signInWithEmailAndPassword(auth, email, password);
   } catch (error) {
      return error instanceof Error ? error.message : "Could not sign you in.";
   }
}

async function logout() {
   const { sdk, auth } = await loadAuth();
   await sdk.signOut(auth);
}

export function AuthProvider({ children }: { children: ReactNode }) {
   const [currentUser, setCurrentUser] = useState<User | null>(null);
   const [authReady, setAuthReady] = useState(false);

   useEffect(() => {
      let active = true;
      let unsubscribe: (() => void) | undefined;
      loadAuth()
         .then(({ auth }) => {
            if (!active) return;
            unsubscribe = auth.onAuthStateChanged((user) => {
               setCurrentUser(user);
               setAuthReady(true);
            });
         })
         .catch(() => {
            if (active) setAuthReady(true);
         });
      return () => {
         active = false;
         unsubscribe?.();
      };
   }, []);

   const value = useMemo(() => ({ currentUser, authReady, loginWithGoogle, signUpUserWithEmailAndPassword, signInWithEmail, logout }), [currentUser, authReady]);
   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
