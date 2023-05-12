import React from "react";

function CommunityColumn({
   children,
   className,
   scroll,
}: {
   children: React.ReactNode;
   className?: string;
   scroll?: () => void;
}) {
   return (
      <div className="flex flex-col items-center text-white drop-shadow-md">
         <div
            className={`flex flex-col overflow-hidden rounded-3xl py-2 ${className}  px-6 `}
         >
            {children}
            <button
               onClick={scroll}
               className="px-8 py-2 mx-auto mt-20 mb-8 font-medium text-black uppercase border-2 border-black w-fit hover:scale-[1.03]"
            >
               Write my story
            </button>
         </div>
      </div>
   );
}

export default CommunityColumn;
