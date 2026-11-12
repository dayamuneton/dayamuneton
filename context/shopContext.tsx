import { createContext, useCallback, useContext, useState, useEffect, useMemo, useRef, type ReactNode } from "react";
import { useAuth } from "./authContext";
import { ShoppingCart } from "../models/shoppingCartModel";

type CartStatus = "loading" | "ready" | "error";

interface CartResult {
   email: string;
   attempt: number;
   status: Exclude<CartStatus, "loading">;
   cart: ShoppingCart | null;
}

interface ShopContextProps {
   shoppingCart: ShoppingCart | null;
   cartStatus: CartStatus;
   retryCart: () => void;
   refreshCart: () => void;
}

const ShopContext = createContext<ShopContextProps | null>(null);

export function useShop() {
   const value = useContext(ShopContext);
   if (!value) throw new Error("useShop requires ShopProvider");
   return value;
}

export function ShopProvider({ children }: { children: ReactNode }) {
   const email = useAuth().currentUser?.email;
   const [result, setResult] = useState<CartResult>();
   const [attempt, setAttempt] = useState(0);
   const channel = useRef<BroadcastChannel>(null);
   const retryCart = useCallback(() => setAttempt((value) => value + 1), []);
   const refreshCart = useCallback(() => {
      retryCart();
      channel.current?.postMessage(email);
   }, [email, retryCart]);

   useEffect(() => {
      if (!email) return;
      const sync = typeof BroadcastChannel === "function" ? new BroadcastChannel("portfolio-cart") : null;
      channel.current = sync;

      function update(event: MessageEvent) {
         if (event.data === email) retryCart();
      }

      function refreshOnReturn() {
         if (document.visibilityState === "visible") retryCart();
      }

      sync?.addEventListener("message", update);
      document.addEventListener("visibilitychange", refreshOnReturn);
      return () => {
         sync?.close();
         channel.current = null;
         document.removeEventListener("visibilitychange", refreshOnReturn);
      };
   }, [email, retryCart]);

   useEffect(() => {
      if (!email) return;
      let active = true;

      void (async () => {
         try {
            const [{ collection, getDocs, limit, query, where }, { db }] = await Promise.all([
               import("firebase/firestore/lite"), import("@/integrations/firebase/firestore-lite"),
            ]);
            if (!active) return;
            const carts = query(collection(db, "shoppingCarts"),
               where("customerEmail", "==", email), where("isActive", "==", true), limit(1));
            const snapshot = (await getDocs(carts)).docs[0];
            if (!active) return;
            const cart = snapshot ? new ShoppingCart({
               id: snapshot.id,
               customerEmail: email,
               cartItems: snapshot.get("cartItems"),
               updatedAt: snapshot.get("updatedAt"),
               subTotal: snapshot.get("subTotal"),
               isActive: true,
               isProcessed: snapshot.get("isProcessed"),
            }) : null;
            setResult({ email, attempt, status: "ready", cart });
         } catch {
            if (active) setResult({ email, attempt, status: "error", cart: null });
         }
      })();
      return () => { active = false; };
   }, [email, attempt]);

   const current = result?.email === email ? result : undefined;
   const shoppingCart = current?.cart ?? null;
   const cartStatus: CartStatus = !email ? "ready" : current?.status === "ready" ? "ready"
      : current?.attempt === attempt ? current?.status ?? "loading" : "loading";
   const value = useMemo(() => ({ shoppingCart, cartStatus, retryCart, refreshCart }), [shoppingCart, cartStatus, retryCart, refreshCart]);
   return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}
