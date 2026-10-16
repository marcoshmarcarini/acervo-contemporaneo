"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

// Simulação das imagens do banner (você pode substituir pelas reais depois)
const BANNERS = [
  {
    id: 1,
    title: "Nova Coleção Outono",
    subtitle: "Design Autoral Brasileiro",
    image: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=2000&auto=format&fit=crop", // Imagem placeholder
    link: "/categoria/mobiliario",
  },
  {
    id: 2,
    title: "Iluminação Contemporânea",
    subtitle: "A forma segue a luz",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2000&auto=format&fit=crop", // Imagem placeholder
    link: "/categoria/iluminacao",
  },
  {
    id: 3,
    title: "Curadoria Acervo",
    subtitle: "Peças exclusivas e atemporais",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2000&auto=format&fit=crop", // Imagem placeholder
    link: "/designers",
  }
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hook do Framer Motion para detectar a rolagem da página
  const { scrollY } = useScroll();

  // Mapeia o valor da rolagem (0 a 400px) para a opacidade (1 a 0)
  const opacity = useTransform(scrollY, [0, 800], [1, 0]);
  
  // Mapeia a rolagem para um leve efeito de escurecimento (filtro escuro)
  const overlayOpacity = useTransform(scrollY, [0, 300], [0.3, 0.7]);

  // Lógica para o slider automático
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === BANNERS.length - 1 ? 0 : prev + 1));
    }, 5000); // Troca a cada 5 segundos

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.section 
      style={{ opacity }} 
      className="relative w-full h-[90vh] md:h-screen overflow-hidden -mt-20" // -mt-20 puxa o banner para trás do Header transparente (se você for fazer o Header transparente depois)
    >
      {BANNERS.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Imagem de Fundo */}
          <Image
            src={banner.image}
            alt={banner.title}
            fill
            className="object-cover object-center"
            priority={index === 0} // A primeira imagem carrega mais rápido
          />
          
          {/* Camada de Sobreposição Dinâmica (Escurece ao rolar) */}
          <motion.div 
            style={{ opacity: overlayOpacity }}
            className="absolute inset-0 bg-black"
          />

          {/* Conteúdo de Texto */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={index === currentSlide ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-white text-sm md:text-base tracking-[0.2em] uppercase mb-4 font-light"
            >
              {banner.subtitle}
            </motion.h2>
            
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={index === currentSlide ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-white text-4xl md:text-6xl lg:text-7xl font-semibold mb-8 tracking-tight"
            >
              {banner.title}
            </motion.h1>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={index === currentSlide ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
               <Link 
                href={banner.link}
                className="inline-block border border-white text-white px-8 py-3 uppercase text-xs tracking-widest hover:bg-white hover:text-black transition-colors duration-300"
              >
                Descubra mais
              </Link>
            </motion.div>
          </div>
        </div>
      ))}

      {/* Indicadores do Slider (Bolinhas) */}
      <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center space-x-3">
        {BANNERS.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-white w-8" : "bg-white/50"
            }`}
            aria-label={`Ir para o slide ${index + 1}`}
          />
        ))}
      </div>
    </motion.section>
  );
}