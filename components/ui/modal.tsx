import React, { useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useClickOutside } from "@/hooks/clickOutside";

interface ModalProps {
   isOpen: boolean;
   onClose: () => void;
   children: React.ReactNode;
   className?: string;
}

function Modal({ isOpen, onClose, children, className }: ModalProps) {
   const modalRef = useRef<HTMLDivElement | null>(null);

   useClickOutside(modalRef, onClose);

   if (!isOpen) return null;
   return (
      <div className="fixed top-0 left-0 flex items-center justify-center w-screen h-screen bg-black/50 z-[10000]">
         <div ref={modalRef} className={`${className} relative`}>
            {children}
         </div>
      </div>
   );
}

export default Modal;
