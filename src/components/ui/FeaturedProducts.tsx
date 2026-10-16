import Link from "next/link";
import Image from "next/image";
import { graphqlRequest } from "@/src/libs/graphqlRequest";

// Query para puxar exatamente 9 produtos do WooCommerce
const GET_LATEST_PRODUCTS = `
  query GetLatestProducts {
    products(first: 9) {
      nodes {
        id
        databaseId
        name
        slug
        image {
          sourceUrl
          altText
        }
        ... on SimpleProduct {
          price
        }
      }
    }
  }
`;

export default async function FeaturedProducts() {
  const data = await graphqlRequest(GET_LATEST_PRODUCTS);
  const produtos = data?.products?.nodes || [];

  if (produtos.length === 0) return null;

  return (
    <section className="py-24 px-4 max-w-7xl mx-auto bg-white">
      {/* Título da Seção */}
      <div className="flex flex-col items-center mb-16">
        <h2 className="text-2xl md:text-3xl font-light text-gray-900 tracking-[0.2em] uppercase text-center">
          Lançamentos
        </h2>
        <div className="w-12 h-[1px] bg-gray-300 mt-6"></div>
      </div>

      {/* Grid Minimalista 3x3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
        {produtos.map((produto: any) => (
          <Link href={`/produtos/${produto.slug}`} key={produto.id} className="group flex flex-col cursor-pointer">
            
            {/* Container da Imagem com proporção de Retrato */}
            <div className="w-full aspect-square bg-gray-50 relative overflow-hidden mb-6">
              {produto.image?.sourceUrl ? (
                <Image
                  src={produto.image.sourceUrl}
                  alt={produto.image.altText || produto.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm font-light">
                  Sem imagem
                </div>
              )}
            </div>

            {/* Tipografia Limpa e Centralizada */}
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-900 uppercase tracking-widest mb-2 line-clamp-1">
                {produto.name}
              </h3>
              <p className="text-gray-500 text-sm font-light">
                {produto.price ? produto.price.replace(/&nbsp;/g, ' ') : "Preço sob consulta"}
              </p>
            </div>
            
          </Link>
        ))}
      </div>

      {/* Botão Saiba Mais */}
      <div className="mt-20 flex justify-center">
        <Link 
          href="/categoria/mobiliario" 
          className="group flex items-center gap-4 text-sm font-medium uppercase tracking-widest text-gray-900 hover:text-gray-500 transition-colors"
        >
          <span>Descubra Mais</span>
          {/* Seta minimalista animada */}
          <svg 
            className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </section>
  );
}