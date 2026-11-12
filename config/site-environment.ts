export const isPreviewSite = process.env.NEXT_PUBLIC_SITE_ENV === "preview";
export const isTestSite = process.env.NEXT_PUBLIC_SITE_ENV !== "production";
export const isLocalSite = isTestSite && !isPreviewSite;

export const localFirebase = {
   projectId: "demo-dayamuneton",
   host: "127.0.0.1",
   authPort: 9099,
   firestorePort: 8080,
   storagePort: 9199,
} as const;
