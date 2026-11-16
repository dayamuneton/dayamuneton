type SkeletonKind = "collection" | "detail" | "form" | "admin" | "page";

export default function PageSkeleton({ kind = "page", label = "Loading page…" }: {
   kind?: SkeletonKind;
   label?: string;
}) {
   return (
      <div className="page-skeleton" data-kind={kind}>
         <p role="status" className="page-skeleton-status">{label}</p>
         <div className="skeleton-intro" aria-hidden="true">
            <span className="skeleton-block skeleton-heading" />
            <span className="skeleton-block skeleton-description" />
         </div>
         <div className="skeleton-content" aria-hidden="true">
            {(kind === "collection" ? [0, 1, 2] : [0, 1]).map((item) => (
               <div className="skeleton-block skeleton-card" key={item} />
            ))}
         </div>
      </div>
   );
}
