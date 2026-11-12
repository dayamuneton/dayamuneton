import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/router";
import PageSkeleton from "./PageSkeleton";

function skeletonFor(url: string) {
   const [section, entry, detail] = url.split(/[?#]/)[0].split("/").filter(Boolean);
   if (section === "admin") return "admin";
   if (section === "auth" || section === "checkout") return "form";
   if ((section === "shop" || section === "ageofemotions") && detail) return "detail";
   if (section === "shop" || (section === "ageofemotions" && entry)) return "collection";
   return "page";
}

export default function RouteFeedback({ children }: { children: ReactNode }) {
   const { events } = useRouter();
   const [pendingUrl, setPendingUrl] = useState<string>();

   useEffect(() => {
      let timer: ReturnType<typeof setTimeout> | undefined;
      let destination: string | undefined;

      function start(url: string, { shallow }: { shallow: boolean }) {
         if (shallow) return;
         clearTimeout(timer);
         destination = url;
         timer = setTimeout(() => setPendingUrl(url), 180);
      }

      function finish(url: string) {
         if (destination !== url) return;
         clearTimeout(timer);
         destination = undefined;
         setPendingUrl(undefined);
      }

      const fail = (_error: unknown, url: string) => finish(url);
      events.on("routeChangeStart", start);
      events.on("routeChangeComplete", finish);
      events.on("routeChangeError", fail);
      return () => {
         clearTimeout(timer);
         events.off("routeChangeStart", start);
         events.off("routeChangeComplete", finish);
         events.off("routeChangeError", fail);
      };
   }, [events]);

   return (
      <main id="main-content" tabIndex={-1} className="site-main">
         <div className="site-page" data-loading={Boolean(pendingUrl)} inert={Boolean(pendingUrl)}>
            {children}
         </div>
         {pendingUrl && <div className="route-skeleton"><PageSkeleton kind={skeletonFor(pendingUrl)} /></div>}
      </main>
   );
}
