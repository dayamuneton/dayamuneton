import { useRef, useState, type PointerEvent } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const testimonies = [
   {
      name: "Michel Leroy",
      language: "en",
      message:
         "Daya, I discovered a new universe with 'The Hidden Artist in Me'. As a math teacher, I have always been surrounded by numbers and formulas, and your guide showed me a different path to understand myself. Art, as a path to self-understanding, is an amazing discovery in my life! Now, thanks to your guidance, I discover a new way of understanding my emotions. Thank you so much, Daya, for this transformative experience!",
   },
   {
      name: "Ricaute Quintero",
      language: "es",
      message:
         "Como médico, estoy constantemente buscando herramientas para mejorar mi bienestar del cuerpo y de la mente. Descubrí 'El Arte Revela La Llave Para Entrar Al Reino Oculto De La Percepción', y ha sido un descubrimiento esclarecedor. Este cuento muestra el poder del arte y la autoconciencia para liberar emociones. Las nuevas perspectivas que me ha aportado han enriquecido mi terapia de formas inesperadas. ¡Una joya gratuita que recomiendo a todos en el camino hacia la auto-conocimiento",
   },
   {
      name: "Booker Brown",
      language: "en",
      message:
         "Wow, Daya, thank you so much for creating 'The Hidden Artist Within'! Your guide has truly opened up a whole new world for me. The idea that every brushstroke reflects my inner self has profoundly shifted my perspective on my own thoughts.Navigating potential pitfalls has become so much easier with your insights - I now feel more confident and empowered in my self-understanding. I can't wait to see what I'll manifest next, all thanks to your guide!",
   },
   {
      name: "Sara Contramaestre",
      language: "es",
      message:
         "He buscado incansablemente entenderme a mí mismo a través de la lectura de numerosos libros de autoayuda y asistencia a diversos talleres. Sin embargo, han sido tus guías y el arte en tus guías el que ha abierto las puertas a la percepción, mostrándome una vía alternativa de comprensión. He logrado entender lo que antes me confundía, pero ahora desde una perspectiva diferente. Ahora comprendo el por qué de mi confusión anterior.",
   },
];

const lastIndex = testimonies.length - 1;
const swipeThreshold = 48;

export default function Testimonies() {
   const [activeIndex, setActiveIndex] = useState(0);
   const swipeStart = useRef<{ x: number; y: number } | null>(null);

   function move(direction: -1 | 1) {
      setActiveIndex((current) => Math.min(lastIndex, Math.max(0, current + direction)));
   }

   function startSwipe(event: PointerEvent<HTMLDivElement>) {
      if (event.pointerType !== "touch") return;
      swipeStart.current = event.isPrimary ? { x: event.clientX, y: event.clientY } : null;
   }

   function finishSwipe(event: PointerEvent<HTMLDivElement>) {
      if (event.pointerType !== "touch" || !event.isPrimary) return;
      const start = swipeStart.current;
      swipeStart.current = null;
      if (!start) return;

      const horizontalDistance = event.clientX - start.x;
      const verticalDistance = event.clientY - start.y;
      if (Math.abs(horizontalDistance) >= swipeThreshold && Math.abs(horizontalDistance) > Math.abs(verticalDistance)) {
         move(horizontalDistance < 0 ? 1 : -1);
      }
   }

   return (
      <section className="testimonials" aria-labelledby="testimonials-heading" aria-roledescription="carousel">
         <h2 className="section-title landing-copy" id="testimonials-heading">What readers say</h2>
         <div className="content-panel testimonials-panel">
            <div className="testimonials-slides" id="testimonial-quotes" onPointerDown={startSwipe} onPointerUp={finishSwipe}
               onPointerCancel={() => { swipeStart.current = null; }}>
               {testimonies.map(({ name, language, message }, index) => (
                  <figure className="testimonial-quote reading-flow" key={name} data-active={activeIndex === index}>
                     <blockquote lang={language}>{message}</blockquote>
                     <figcaption className="text-ink font-semibold">{name}</figcaption>
                  </figure>
               ))}
            </div>
            <div className="testimonials-controls">
               <button type="button" className="portfolio-button portfolio-button-secondary" aria-label="Previous testimonial"
                  aria-controls="testimonial-quotes" aria-disabled={activeIndex === 0} onClick={() => move(-1)}>
                  <FiChevronLeft aria-hidden="true" />
               </button>
               <p className="testimonials-position" role="status">
                  <span aria-hidden="true">{activeIndex + 1} / {testimonies.length}</span>
                  <span className="sr-only">Testimonial {activeIndex + 1} of {testimonies.length}, {testimonies[activeIndex].name}</span>
               </p>
               <button type="button" className="portfolio-button portfolio-button-secondary" aria-label="Next testimonial"
                  aria-controls="testimonial-quotes" aria-disabled={activeIndex === lastIndex} onClick={() => move(1)}>
                  <FiChevronRight aria-hidden="true" />
               </button>
            </div>
         </div>
      </section>
   );
}
