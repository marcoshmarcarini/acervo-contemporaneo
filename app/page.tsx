import HeroBanner from "@/src/components/ui/HeroBanner";
import FeaturedProducts from "@/src/components/ui/FeaturedProducts";
import CategoryHighlights from "@/src/components/ui/CategoryHighlights";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* O Banner Rotativo */}
      <HeroBanner />

      {/* Texto institucional (pode ajustar como quiser depois) */}
      <section className="py-32 px-4 max-w-7xl mx-auto relative z-10 bg-white">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-light text-gray-800 mb-6">A Essência do Design</h2>
          <p className="text-gray-500 leading-relaxed font-light">
            Design como linguagem. Estética como filosofia. Cada criação carrega um senso de precisão silenciosa e refinamento atemporal, transformando a função em sentimento e o cotidiano em arte.
          </p>
        </div>
      </section>
      <CategoryHighlights />
      {/* A Vitrine Minimalista com 9 produtos */}
      <FeaturedProducts />
      
    </main>
  );
}