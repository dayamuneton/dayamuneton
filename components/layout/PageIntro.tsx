import type { ReactNode } from "react";

export default function PageIntro({ title, description, children }: {
   title: string;
   description?: string;
   children?: ReactNode;
}) {
   return (
      <header className="page-intro">
         <h1>{title}</h1>
         {description && <p>{description}</p>}
         {children && <div className="portfolio-actions">{children}</div>}
      </header>
   );
}
