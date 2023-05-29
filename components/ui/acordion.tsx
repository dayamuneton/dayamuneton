import React, { useState, useContext, createContext, ReactNode } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface AcordionContextProps {
   isOpen: boolean;
   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AcordionContext = createContext<AcordionContextProps | undefined>(
   undefined
);

export function Acordion({
   children,
   className,
}: {
   children: ReactNode;
   className?: string;
}) {
   const [isOpen, setIsOpen] = useState(false);

   return (
      <AcordionContext.Provider value={{ isOpen, setIsOpen }}>
         <div className={`flex flex-col ${className}`}>{children}</div>
      </AcordionContext.Provider>
   );
}

export function AcordionButton({
   children,
   className,
}: {
   children: ReactNode;
   className?: string;
}) {
   const context = useContext(AcordionContext);
   if (!context) {
      throw new Error("AcordionButton must be used within an Acordion");
   }

   const { setIsOpen } = context;

   return (
      <button
         onClick={() => setIsOpen((isOpen) => !isOpen)}
         className={className}
      >
         {children}
      </button>
   );
}

export function AcordionContent({
   children,
   className,
}: {
   children: ReactNode;
   className?: string;
}) {
   const context = useContext(AcordionContext);
   if (!context) {
      throw new Error("AcordionContent must be used within an Acordion");
   }

   const { isOpen } = context;

   return (
      <div
         className={`overflow-hidden transition-all duration-300 ease-in-out w-full ${
            isOpen ? "max-h-[300vh]" : "max-h-[0vh]"
         }`}
      >
         <div className={className}>{children}</div>
      </div>
   );
}

export function AcordionIcon({
   className,
   open,
   close,
   icon,
   size,
}: {
   className?: string;
   open?: string;
   close?: string;
   icon?: ReactNode;
   size?: string;
}) {
   const context = useContext(AcordionContext);
   if (!context) {
      throw new Error("AcordionIcon must be used within an Acordion");
   }
   const { isOpen } = context;
   return (
      <div
         className={`${className} ${
            isOpen ? open || "rotate-180" : close || "rotate-0"
         } transition-all duration-300 ease-in-out`}
      >
         {icon ? icon : <KeyboardArrowDownIcon sx={{ fontSize: size }} />}
      </div>
   );
}
