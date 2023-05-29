import React, { createContext, useContext, useState, useEffect } from "react";
import {
   createUserWithEmailAndPassword,
   signInWithEmailAndPassword,
   signInWithPopup,
   signOut,
   updateProfile,
   sendSignInLinkToEmail,
   isSignInWithEmailLink,
   signInWithEmailLink,
} from "firebase/auth";
import {
   auth,
   db,
   googleProvider,
} from "@/integrations/firebase/firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
// import { Profile, profileConverter } from "@/models/profileModel";

interface AuthContextProps {
   setCurrentUser: React.Dispatch<React.SetStateAction<any>>;
   currentUser: any;
   loginWithGoogle: () => Promise<unknown>;
   signUpUserWithEmailAndPassword: (
      email: string,
      password: string,
      name: string
   ) => Promise<any>;
   signInWithEmail: (email: string, password: string) => Promise<any>;
   logout: () => Promise<void>;
   user: any;
   setUser: React.Dispatch<React.SetStateAction<any>>;
   registerUserWithEmailLink: (
      email: string,
      url: string
   ) => Promise<void | unknown>;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export function useAuth() {
   return useContext(AuthContext as React.Context<AuthContextProps>);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
   const [currentUser, setCurrentUser] = useState<any>();
   const [user, setUser] = useState();
   const [loaded, setLoaded] = useState(false);

   async function loginWithGoogle() {
      try {
         await signInWithPopup(auth, googleProvider);
      } catch (error) {
         console.error(error);
         return error;
      }
   }

   async function signUpUserWithEmailAndPassword(
      email: string,
      password: string,
      name: string
   ) {
      try {
         await createUserWithEmailAndPassword(auth, email, password);

         if (!auth.currentUser) return;

         await updateProfile(auth.currentUser, {
            displayName: name,
         });
      } catch (error: any) {
         console.log(error);

         return error.message;
      }
   }

   async function signInWithEmail(email: string, password: string) {
      try {
         await signInWithEmailAndPassword(auth, email, password);
      } catch (error: any) {
         console.log(error);

         return error.message;
      }
   }

   async function logout() {
      await signOut(auth);
   }

   async function registerUserWithEmailLink(email: string, url: string) {
      // If the user is re-entering their email address but already has a code
      if (isSignInWithEmailLink(auth, url) && !!email) {
         // Sign the user in
         try {
            await signInWithEmailLink(auth, email, url);
         } catch (error) {
            console.error(error);
            return error;
         }
         return;
      }

      try {
         await sendSignInLinkToEmail(auth, email, {
            url,
            handleCodeInApp: true,
         });
         window.localStorage.setItem("emailForSignIn", email);
      } catch (error) {
         console.error(error);
         return error;
      }
   }

   useEffect(() => {
      const unSubscribe = auth.onAuthStateChanged((user) => {
         setCurrentUser(user);
         setLoaded(true);
      });
      return unSubscribe;
   }, []);

   // useEffect(() => {
   //    if (!currentUser) {
   //       setProfile(null);
   //       return;
   //    }

   //    const userRef = doc(db, "users", currentUser.email).withConverter(
   //       profileConverter
   //    );
   //    const unSubscribe = onSnapshot(
   //       userRef,
   //       (snapshot) => setProfile(snapshot.data() || null),
   //       (e) => console.error(e)
   //    );

   //    return unSubscribe;
   // }, [currentUser]);

   const value = {
      setCurrentUser,
      currentUser,
      loginWithGoogle,
      signUpUserWithEmailAndPassword,
      signInWithEmail,
      logout,
      user,
      setUser,
      registerUserWithEmailLink,
   };

   return (
      <AuthContext.Provider value={value}>
         {loaded && children}
      </AuthContext.Provider>
   );
}
