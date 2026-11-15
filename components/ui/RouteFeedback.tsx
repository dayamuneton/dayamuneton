import { useEffect, useRef, useState, type ReactNode } from "react";
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
   const main = useRef<HTMLElement>(null);

   useEffect(() => {
      let timer: ReturnType<typeof setTimeout> | undefined;
      let destination: string | undefined;
      let frame = 0;
      let origin: HTMLElement | undefined;

      function start(url: string, { shallow }: { shallow: boolean }) {
         if (shallow) return;
         clearTimeout(timer);
         cancelAnimationFrame(frame);
         setPendingUrl(undefined);
         origin = document.activeElement instanceof HTMLElement ? document.activeElement : undefined;
         destination = url;
         timer = setTimeout(() => setPendingUrl(url), 180);
      }

      function finish(url: string, completed: boolean) {
         if (destination !== url) return;
         clearTimeout(timer);
         destination = undefined;
         setPendingUrl(undefined);
         const focusTarget = completed ? main.current : origin;
         frame = requestAnimationFrame(() => {
            if (focusTarget?.isConnected) focusTarget.focus({ preventScroll: true });
         });
      }

      const complete = (url: string) => finish(url, true);
      const fail = (_error: unknown, url: string) => finish(url, false);
      events.on("routeChangeStart", start);
      events.on("routeChangeComplete", complete);
      events.on("routeChangeError", fail);
      return () => {
         clearTimeout(timer);
         cancelAnimationFrame(frame);
         events.off("routeChangeStart", start);
         events.off("routeChangeComplete", complete);
         events.off("routeChangeError", fail);
      };
   }, [events]);

   return (
      <main ref={main} id="main-content" tabIndex={-1} className="site-main">
         <div className="site-page" data-loading={Boolean(pendingUrl)} aria-busy={Boolean(pendingUrl)} inert={Boolean(pendingUrl)}>
            {children}
         </div>
         {pendingUrl && <div className="route-skeleton"><PageSkeleton kind={skeletonFor(pendingUrl)} /></div>}
      </main>
   );
}
