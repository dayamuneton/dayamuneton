import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function RouteFeedback() {
   const { events } = useRouter();
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      let timer: ReturnType<typeof setTimeout> | undefined;
      let destination: string | undefined;

      function start(url: string, { shallow }: { shallow: boolean }) {
         if (shallow) return;
         clearTimeout(timer);
         destination = url;
         timer = setTimeout(() => setLoading(true), 180);
      }

      function finish(url: string) {
         if (destination !== url) return;
         clearTimeout(timer);
         destination = undefined;
         setLoading(false);
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

   return <div role="status" className={loading ? "route-feedback" : "sr-only"}>{loading ? "Loading page…" : ""}</div>;
}
