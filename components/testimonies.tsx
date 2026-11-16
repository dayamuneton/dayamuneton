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

export default function Testimonies() {
   return (
      <section className="testimonials" aria-labelledby="testimonials-heading" aria-roledescription="carousel">
         <h2 className="section-title landing-copy" id="testimonials-heading">What readers say</h2>
         <div className="testimonials-track" role="group" aria-label="Scroll through testimonials" tabIndex={0}>
            {testimonies.map(({ name, language, message }) => (
               <figure className="testimonial-quote reading-flow" key={name}>
                  <blockquote lang={language}>{message}</blockquote>
                  <figcaption className="font-semibold">{name}</figcaption>
               </figure>
            ))}
         </div>
      </section>
   );
}
