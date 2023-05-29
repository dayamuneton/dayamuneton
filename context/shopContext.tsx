import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "@/integrations/firebase/firebaseConfig";
import { collection, onSnapshot, query, where } from "firebase/firestore";
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
   return useContext(ShopContext as React.Context<ShopContextProps>);
}

export function ShopProvider({ children }: { children: React.ReactNode }) {
   const { currentUser } = useAuth();
   const [shoppingCart, setShoppingCart] = useState<ShoppingCart | null>(null);

   useEffect(() => {
      if (!currentUser) {
         setShoppingCart(null);
         return;
      }

      const shoppingCartRef = collection(db, "shoppingCarts").withConverter(
         shoppingCartConverter
      );

      const shoppingCartQuery = query(
         shoppingCartRef,
         where("customerEmail", "==", currentUser?.email),
         where("isActive", "==", true)
      );

      const unSubscribeShoppingCart = onSnapshot(
         shoppingCartQuery,
         (snapshot) => {
            const shoppingCartData = snapshot.docs[0]?.data() || null;
            setShoppingCart(shoppingCartData);
         }
      );
      return () => {
         unSubscribeShoppingCart();
      };
   }, [currentUser]);

   const value = {
      shoppingCart,
      setShoppingCart,
   };

   return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}
