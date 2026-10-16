import Image from "next/image";
import Link from "next/link";

export default function CategoryHighlights() {
  return (
    <section className="py-24 px-4 max-w-7xl mx-auto bg-white">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:h-[700px]">
        
        {/* Bloco Principal - Ocupa 7 colunas */}
        <Link 
          href="/categoria/mobiliario" 
          className="group relative md:col-span-7 h-[500px] md:h-full overflow-hidden bg-gray-100"
        >
          <Image
            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200&auto=format&fit=crop"
            alt="Mobiliário Contemporâneo"
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
          />
          {/* Overlay sutil para garantir leitura do texto */}
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500" />
          
          <div className="absolute bottom-12 left-10 text-white z-10">
            <h3 className="text-3xl md:text-4xl font-light tracking-[0.1em] uppercase mb-4">
              Mobiliário
            </h3>
            <span className="text-sm uppercase tracking-widest border-b border-white/50 pb-1 group-hover:border-white transition-colors duration-300">
              Explorar coleção
            </span>
          </div>
        </Link>

        {/* Coluna da Direita - Ocupa 5 colunas, dividida em dois blocos empilhados */}
        <div className="md:col-span-5 flex flex-col gap-4 h-[800px] md:h-full">
          
          {/* Bloco Secundário Superior */}
          <Link 
            href="/categoria/iluminacao" 
            className="group relative flex-1 overflow-hidden bg-gray-100"
          >
            <Image
              src="https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop"
              alt="Iluminação"
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500" />
            <div className="absolute bottom-10 left-8 text-white z-10">
              <h3 className="text-2xl font-light tracking-[0.1em] uppercase mb-3">
                Iluminação
              </h3>
              <span className="text-xs uppercase tracking-widest border-b border-white/50 pb-1 group-hover:border-white transition-colors duration-300">
                Ver peças
              </span>
            </div>
          </Link>

          {/* Bloco Secundário Inferior */}
          <Link 
            href="/categoria/decoracao" 
            className="group relative flex-1 overflow-hidden bg-gray-100"
          >
            <Image
              src="https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=800&auto=format&fit=crop"
              alt="Objetos e Decoração"
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500" />
            <div className="absolute bottom-10 left-8 text-white z-10">
              <h3 className="text-2xl font-light tracking-[0.1em] uppercase mb-3">
                Decoração
              </h3>
              <span className="text-xs uppercase tracking-widest border-b border-white/50 pb-1 group-hover:border-white transition-colors duration-300">
                Detalhes
              </span>
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
}