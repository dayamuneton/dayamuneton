import React, { useState, useEffect } from "react";
import StarIcon from "@mui/icons-material/Star";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

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
   const [currentTestimonyIndex, setCurrentTestimonyIndex] = useState(0);
   const [previousTestimonyIndex, setPreviousTestimonyIndex] = useState(0);

   const goToPreviousTestimony = () => {
      setPreviousTestimonyIndex(currentTestimonyIndex);
      setCurrentTestimonyIndex((prevIndex) =>
         prevIndex > 0 ? prevIndex - 1 : testimonies.length - 1
      );
   };

   const goToNextTestimony = () => {
      setPreviousTestimonyIndex(currentTestimonyIndex);
      setCurrentTestimonyIndex((prevIndex) =>
         prevIndex < testimonies.length - 1 ? prevIndex + 1 : 0
      );
   };

   let transitionDirection =
      currentTestimonyIndex > previousTestimonyIndex ? "forward" : "backward";

   transitionDirection =
      currentTestimonyIndex === 0 &&
      previousTestimonyIndex === testimonies.length - 1
         ? "forward"
         : transitionDirection;

   transitionDirection =
      currentTestimonyIndex === testimonies.length - 1 &&
      previousTestimonyIndex === 0
         ? "backward"
         : transitionDirection;

   return (
      <div className="flex w-[90vw] max-w-xl gap-4 overflow-hidden justify-center items-center flex-col">
         <div
            key={currentTestimonyIndex}
            style={{
               backgroundImage:
                  "radial-gradient(circle at center, #4a23a9, #5cdde5)",
            }}
            className={`flex flex-col min-w-[23vw] max-w-sm rounded-xl px-8 pt-12 pb-8 transition-all duration-500 drop-shadow-md ${
               transitionDirection === "forward"
                  ? "animate-slide-in-right"
                  : "animate-slide-in-left"
            }`}
         >
            <p>{testimonies[currentTestimonyIndex].message}</p>
            <p className="ml-auto">{testimonies[currentTestimonyIndex].name}</p>
            <span className="text-yellow-300">
               <StarIcon />
               <StarIcon />
               <StarIcon />
               <StarIcon />
               <StarIcon />
            </span>
         </div>
         <div className="flex justify-between w-full max-w-sm mb-4">
            <button onClick={goToPreviousTestimony}>
               <ChevronLeftIcon style={{ fontSize: "2.5rem" }} />
            </button>
            <button onClick={goToNextTestimony}>
               <ChevronRightIcon style={{ fontSize: "2.5rem" }} />
            </button>
         </div>
      </div>
   );
}

export default Testimonies;
