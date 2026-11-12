import { useId, useState, type ReactNode } from "react";
import { FiChevronDown } from "react-icons/fi";

export default function Disclosure({ label, children }: { label: string; children: ReactNode }) {
   const [open, setOpen] = useState(false);
   const id = useId();

   return (
      <div className="action-disclosure">
         <button type="button" aria-controls={id} aria-expanded={open}
            onClick={() => setOpen((current) => !current)} className="portfolio-button portfolio-button-primary disclosure-trigger">
            {label}<FiChevronDown aria-hidden="true" />
         </button>
         <div id={id} inert={!open} className="disclosure-content" data-open={open}>
            <div className="disclosure-clip"><div className="disclosure-body">{children}</div></div>
         </div>
      </div>
   );
}
