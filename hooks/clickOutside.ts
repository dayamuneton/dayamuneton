import { useEffect, type RefObject } from "react";

export function useClickOutside(ref: RefObject<HTMLElement | null>, handler: () => void) {
   useEffect(() => {
      const listener = (event: PointerEvent) => {
         if (ref.current && event.target instanceof Node && !ref.current.contains(event.target)) handler();
      };
      document.addEventListener("pointerdown", listener);
      return () => document.removeEventListener("pointerdown", listener);
   }, [ref, handler]);
}
