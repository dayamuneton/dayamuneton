import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { deleteDoc, doc } from "firebase/firestore/lite";
import { db } from "@/integrations/firebase/firestore-lite";
import ArtworkImage from "@/components/ui/ArtworkImage";
import Modal from "@/components/ui/modal";
import { formatDate } from "@/utils/formatDate";
import { paintingCategories, guideCategories } from "@/features/catalog/categories";
import type { GuiaProductVariant } from "@/models/guiaProductModel";
import type { AdminDocument } from "./AdminEditorRoute";
import { catalogCollections, catalogLabels, type CatalogKind } from "./catalogConfig";
import { saveProduct, type EditorImage } from "./saveProduct";

const techniques = ["Acrylic", "Abstraction", "Expressionism", "Mixed Media", "Digital Art"];
const artworkCategories = [...paintingCategories, { slug: "custom", title: "Custom" }];
const imageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);
const maxImageSize = 10 * 1024 * 1024;

export default function CatalogEditor({ product, kind }: { product: AdminDocument | null; kind: CatalogKind }) {
   const router = useRouter();
   const deleteTrigger = useRef<HTMLButtonElement>(null);
   const painting = kind === "paintings";
   const label = catalogLabels[kind];
   const listPath = "/admin/" + kind;
   const [pending, setPending] = useState(false);
   const [deleting, setDeleting] = useState(false);
   const [confirm, setConfirm] = useState(false);
   const [error, setError] = useState("");
   const [deleteError, setDeleteError] = useState("");
   const [saved, setSaved] = useState(false);
   const [images, setImages] = useState<EditorImage[]>(() => {
      const urls: string[] = product?.images ?? [];
      return [...new Set([product?.featuredImage, ...urls].filter(Boolean) as string[])].map((url) => ({ url }));
   });
   const [featured, setFeatured] = useState(product?.featuredImage || product?.images?.[0] || "");
   const [variants, setVariants] = useState<GuiaProductVariant[]>(product?.variants ?? []);
   const previewUrls = useRef(new Set<string>());

   useEffect(() => {
      const urls = previewUrls.current;
      return () => { urls.forEach((url) => URL.revokeObjectURL(url)); };
   }, []);

   function addImages(files: File[]) {
      setError("");
      const added = files.filter((file) => imageTypes.has(file.type) && file.size <= maxImageSize).map((file) => {
         const url = URL.createObjectURL(file);
         previewUrls.current.add(url);
         return { url, file };
      });
      if (added.length < files.length) setError("Choose JPEG, PNG, WebP, GIF, or AVIF images up to 10 MB each.");
      setImages((current) => [...current, ...added]);
      if (!featured && added[0]) setFeatured(added[0].url);
   }

   function removeImage(url: string) {
      const remaining = images.filter((image) => image.url !== url);
      setImages(remaining);
      if (featured === url) setFeatured(remaining[0]?.url || "");
      setVariants((current) => current.map((variant) => variant.image === url ? { ...variant, image: "" } : variant));
      if (previewUrls.current.delete(url)) URL.revokeObjectURL(url);
   }

   function updateVariant(id: string, patch: Partial<GuiaProductVariant>) {
      setVariants((current) => current.map((variant) => variant.id === id ? { ...variant, ...patch } : variant));
   }

   async function submit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      if (pending || deleting) return;
      const fields = new FormData(event.currentTarget);
      const text = (key: string) => String(fields.get(key) ?? "").trim();
      setSaved(false);
      setError("");
      if (!text("name") || !images.length) {
         setError("Enter a name and add at least one image.");
         return;
      }
      if (text("externalLink") && !/^https?:\/\//i.test(text("externalLink"))) {
         setError("Enter an external link that starts with https:// or http://.");
         return;
      }

      setPending(true);
      try {
         const result = await saveProduct(kind, product ? { id: product.id, handle: product.handle } : null, {
            name: text("name"),
            description: text("description"),
            price: Number(fields.get("price")),
            date: Number(fields.get("date")),
            category: text("category"),
            available: text("status") === "available",
            shippingInformation: text("shipping"),
            techniques: fields.getAll("technique").map(String),
            featuredImage: featured,
            images,
            beneficts: text("benefits"),
            externalLink: text("externalLink"),
            externalLinkText: text("externalLinkText"),
            variants,
         });
         if (!product) {
            await router.replace(listPath + "/" + encodeURIComponent(result.id));
            return;
         }
         setImages(result.images.map((url) => ({ url })));
         setFeatured(result.featuredImage);
         setVariants((current) => current.map((variant) => ({ ...variant, image: result.imageUrls.get(variant.image) || variant.image })));
         for (const url of previewUrls.current) URL.revokeObjectURL(url);
         previewUrls.current.clear();
         setSaved(true);
      } catch (failure) {
         setError(failure instanceof Error ? failure.message : "Couldn’t save your changes.");
      } finally {
         setPending(false);
      }
   }

   async function removeProduct() {
      if (!product || deleting) return;
      setDeleting(true);
      setDeleteError("");
      try {
         await deleteDoc(doc(db, catalogCollections[kind], product.id));
         await router.replace(listPath);
      } catch {
         setDeleteError("Couldn’t delete this " + label + ". Please try again.");
      } finally {
         setDeleting(false);
      }
   }

   return (
      <div className="admin-editor">
         <Link className="back-link" href={listPath}>← All {kind}</Link>
         <form onSubmit={submit} className="form-stack" onChange={() => setSaved(false)}>
            <fieldset disabled={pending} className="content-panel form-stack">
               <legend className="section-title px-1">Product details</legend>
               <label>Name<input name="name" defaultValue={product?.name} required /></label>
               <label>Description<textarea name="description" rows={5} defaultValue={product?.description} /></label>
               <div className="editor-fields">
                  <label>Price (USD)<input name="price" type="number" min="0" step="0.01" required defaultValue={product?.price ?? 0} /></label>
                  <label>Date (YYYYMMDD)<input name="date" type="number" min="0" required defaultValue={product?.date ?? formatDate()} /></label>
                  <label>Category<select name="category" defaultValue={product?.category} required>
                     {(painting ? artworkCategories : guideCategories).map(({ slug, title }) => <option key={slug} value={slug}>{title}</option>)}
                  </select></label>
                  {painting && <label>Status<select name="status" defaultValue={product && (product.status === 1 || product.status === "available" || (product.available > 0 && product.status !== 0)) ? "available" : "soldout"}>
                     <option value="available">Available</option><option value="soldout">Sold out</option>
                  </select></label>}
               </div>
               {painting ? <>
                  <label>Shipping information<textarea name="shipping" rows={3} defaultValue={product?.shippingInformation} /></label>
                  <fieldset>
                     <legend className="font-semibold mb-2">Techniques</legend>
                     <div className="editor-options">
                        {[...new Set<string>([...techniques, ...(product?.techniques ?? [])])].map((technique) => (
                           <label className="check-field" key={technique}>
                              <input type="checkbox" name="technique" value={technique} defaultChecked={product?.techniques?.includes(technique)} />{technique}
                           </label>
                        ))}
                     </div>
                  </fieldset>
               </> : <>
                  <label>Benefits<textarea name="benefits" rows={5} defaultValue={product?.beneficts} /></label>
                  <label>External purchase URL<input name="externalLink" type="url" defaultValue={product?.externalLink} /></label>
                  <label>External link label<input name="externalLinkText" defaultValue={product?.externalLinkText} /></label>
               </>}
            </fieldset>
            <fieldset disabled={pending} className="content-panel form-stack">
               <legend className="section-title px-1">Artwork images</legend>
               <label>Add images<input type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif,image/avif" onChange={(event) => {
                  addImages(Array.from(event.currentTarget.files ?? []));
                  event.currentTarget.value = "";
               }} /></label>
               {images.length > 0 && <ul className="editor-images">
                  {images.map(({ url }, index) => (
                     <li key={url}>
                        <div className="editor-image"><ArtworkImage src={url} alt="" fill sizes="128px" className="object-cover" /></div>
                        <label className="check-field"><input type="radio" name="featured" checked={featured === url}
                           aria-label={`Feature image ${index + 1}`} onChange={() => setFeatured(url)} /> Cover</label>
                        <button type="button" className="form-link min-h-11" aria-label={`Remove image ${index + 1}`}
                           onClick={() => removeImage(url)}>Remove</button>
                     </li>
                  ))}
               </ul>}
            </fieldset>
            {!painting && <fieldset disabled={pending} className="content-panel form-stack">
               <legend className="section-title px-1">Guide options</legend>
               {variants.map((variant, index) => (
                  <fieldset key={variant.id} className="editor-variant form-stack">
                     <legend className="font-semibold px-1">Option {index + 1}</legend>
                     <div className="editor-fields">
                        <label>Title<input required value={variant.title} onChange={(event) => updateVariant(variant.id, { title: event.target.value })} /></label>
                        <label>MailerLite group<input value={variant.mailerlite_group} onChange={(event) => updateVariant(variant.id, { mailerlite_group: event.target.value })} /></label>
                        <label>Option image<select value={variant.image} onChange={(event) => updateVariant(variant.id, { image: event.target.value })}>
                           <option value="">Use the cover</option>
                           {images.map(({ url }, index) => <option key={url} value={url}>Image {index + 1}</option>)}
                           {variant.image && !images.some(({ url }) => url === variant.image) && <option value={variant.image}>Current image</option>}
                        </select></label>
                     </div>
                     <button type="button" className="form-link justify-self-start min-h-11"
                        onClick={() => setVariants((current) => current.filter(({ id }) => id !== variant.id))}>Remove option</button>
                  </fieldset>
               ))}
               <button type="button" className="portfolio-button portfolio-button-secondary justify-self-start" onClick={() => {
                  setVariants((current) => [...current, { id: crypto.randomUUID(), title: "", image: "", price: 0, mailerlite_group: "" }]);
               }}>Add option</button>
            </fieldset>}
            {error && <p className="form-feedback" role="alert">{error}</p>}
            {saved && <p role="status">Changes saved.</p>}
            <div className="editor-actions">
               <button className="portfolio-button portfolio-button-primary" type="submit" disabled={pending}>{pending ? "Saving…" : "Save " + label}</button>
               {product && <button ref={deleteTrigger} type="button" className="portfolio-button portfolio-button-secondary text-danger" disabled={pending}
                  onClick={() => { setDeleteError(""); setConfirm(true); }}>Delete {label}</button>}
            </div>
         </form>
         <Modal returnFocusRef={deleteTrigger} isOpen={confirm} label={"Delete " + label} onClose={() => { if (!deleting) setConfirm(false); }}>
            <div className="reading-flow">
               <h2>Delete {product?.name || "this " + label}?</h2>
               <p>This removes the listing from the portfolio.</p>
               {deleteError && <p className="form-feedback" role="alert">{deleteError}</p>}
               <div className="editor-actions">
                  <button type="button" disabled={deleting} className="portfolio-button portfolio-button-secondary" onClick={() => setConfirm(false)}>Cancel</button>
                  <button type="button" disabled={deleting} className="portfolio-button portfolio-button-primary"
                     onClick={removeProduct}>{deleting ? "Deleting…" : "Delete"}</button>
               </div>
            </div>
         </Modal>
      </div>
   );
}
