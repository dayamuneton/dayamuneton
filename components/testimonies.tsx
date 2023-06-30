import React from "react";
import StarIcon from "@mui/icons-material/Star";

const testimonies = [
   {
      name: "Michel Leroy",
      message:
         "Daya, I discovered a new universe with 'The Hidden Artist in Me'. As a math teacher, I have always been surrounded by numbers and formulas, and your guide showed me a different path to understand myself. Art, as a path to self-understanding, is an amazing discovery in my life! Now, thanks to your guidance, I discover a new way of understanding my emotions. Thank you so much, Daya, for this transformative experience!",
   },
   {
      name: "Ricaute Quintero",
      message:
         "Como médico, estoy constantemente buscando herramientas para mejorar mi bienestar del cuerpo y de la mente. Descubrí 'El Arte Revela La Llave Para Entrar Al Reino Oculto De La Percepción', y ha sido un descubrimiento esclarecedor. Este cuento muestra el poder del arte y la autoconciencia para liberar emociones. Las nuevas perspectivas que me ha aportado han enriquecido mi terapia de formas inesperadas. ¡Una joya gratuita que recomiendo a todos en el camino hacia la auto-conocimiento",
   },
   {
      name: "Booker Brown",
      message:
         "Wow, Daya, thank you so much for creating 'The Hidden Artist Within'! Your guide has truly opened up a whole new world for me. The idea that every brushstroke reflects my inner self has profoundly shifted my perspective on my own thoughts.Navigating potential pitfalls has become so much easier with your insights - I now feel more confident and empowered in my self-understanding. I can't wait to see what I'll manifest next, all thanks to your guide!",
   },
   {
      name: "Sara Contramaestre",
      message:
         "He buscado incansablemente entenderme a mí mismo a través de la lectura de numerosos libros de autoayuda y asistencia a diversos talleres. Sin embargo, han sido tus guías y el arte en tus guías el que ha abierto las puertas a la percepción, mostrándome una vía alternativa de comprensión. He logrado entender lo que antes me confundía, pero ahora desde una perspectiva diferente. Ahora comprendo el por qué de mi confusión anterior.",
   },
];

function Testimonies() {
   return (
      <div className="grid md:w-[90vw] md:max-w-2xl md:auto-cols-[60%] lg:auto-cols-[40%] auto-cols-[95%] grid-flow-col max-w-[90vw] lg:w-[90vw] lg:max-w-5xl gap-4  overflow-x-auto  overscroll-x-contain snap-mandatory snap-x hide-scrollbar px-4 rounded-xl mb-8">
         {testimonies.map((testimony) => (
            <div
               key={testimony.message}
               style={{
                  backgroundImage:
                     "radial-gradient(circle at center, #4a23a9, #5cdde5)",
               }}
               className={`flex flex-col  w-full  rounded-xl px-8 pt-12 pb-8 transition-all duration-500 drop-shadow-md snap-start mx-auto `}
            >
               <p>{testimony.message}</p>
               <p className="ml-auto">{testimony.name}</p>
               <span className="text-yellow-300">
                  <StarIcon />
                  <StarIcon />
                  <StarIcon />
                  <StarIcon />
                  <StarIcon />
               </span>
            </div>
         ))}
      </div>
   );
}

export default Testimonies;
