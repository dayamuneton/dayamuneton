import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./authContext";
import {
ShoppingCart,
shoppingCartConverter,
} from "../models/shoppingCartModel";

interface ShopContextProps {
   shoppingCart: ShoppingCart | null;
   setShoppingCart: React.Dispatch<React.SetStateAction<ShoppingCart | null>>;
}

const ShopContext = createContext<ShopContextProps | null>(null);

export function useShop() {
   const value = useContext(ShopContext);
   if (!value) throw new Error("useShop requires ShopProvider");
   return value;
}

export function ShopProvider({ children }: { children: React.ReactNode }) {
   const email = useAuth().currentUser?.email;
   const [shoppingCart, setShoppingCart] = useState<ShoppingCart | null>(null);

   useEffect(() => {
      if (!email) return;
      let active = true;
      let unsubscribe: (() => void) | undefined;
      Promise.all([import("firebase/firestore"), import("@/integrations/firebase/firebaseConfig")])
         .then(([{ collection, limit, onSnapshot, query, where }, { db }]) => {
            if (!active) return;
            const carts = collection(db, "shoppingCarts").withConverter(shoppingCartConverter);
            const activeCart = query(carts, where("customerEmail", "==", email),
               where("isActive", "==", true), limit(1));
            unsubscribe = onSnapshot(activeCart,
               (snapshot) => setShoppingCart(snapshot.docs[0]?.data() ?? null),
               () => setShoppingCart(null));
         })
         .catch(() => { if (active) setShoppingCart(null); });
      return () => {
         active = false;
         unsubscribe?.();
      };
   }, [email]);

   const value = {
      shoppingCart: email && shoppingCart?.customerEmail === email ? shoppingCart : null,
      setShoppingCart,
   };

   return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}
