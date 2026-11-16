import { useEffect, useRef, type ReactNode, type RefObject } from "react";

interface ModalProps {
   isOpen: boolean;
   onClose: () => void;
   children: ReactNode;
   className?: string;
   label?: string;
   returnFocusRef?: RefObject<HTMLElement | null>;
}

export default function Modal({ isOpen, onClose, children, className = "", label = "Confirm change", returnFocusRef }: ModalProps) {
   const ref = useRef<HTMLDialogElement>(null);

   useEffect(() => {
      const dialog = ref.current;
      if (!dialog) return;
      const returnFocus = returnFocusRef?.current;
      if (isOpen && !dialog.open) dialog.showModal();
      if (!isOpen && dialog.open) dialog.close();
      return () => {
         if (dialog.open) {
            dialog.close();
            returnFocus?.focus();
         }
      };
   }, [isOpen, returnFocusRef]);

   return (
      <dialog ref={ref} className="site-dialog" aria-label={label}
         onCancel={(event) => { event.preventDefault(); onClose(); }}
         onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
         <div className={"dialog-panel " + className}>{isOpen && children}</div>
      </dialog>
   );
}
