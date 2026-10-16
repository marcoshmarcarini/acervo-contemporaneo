import { graphqlRequest } from "@/src/libs/graphqlRequest";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// A query agora busca primeiro a Categoria, e depois os Produtos dentro dela
const GET_PRODUTOS_POR_CATEGORIA = `
  query GetCategoria($slug: ID!) {
    productCategory(id: $slug, idType: SLUG) {
      name
      products(first: 20) {
        nodes {
          id
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
  }
`;

// Como usamos [...slug], a tipagem do params é um array de strings
export default async function CategoriaPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  
  // Pega sempre o último termo do link (ex: em /mobiliario/cadeiras, pega "cadeiras")
  const categoriaSlug = slug[slug.length - 1];

  const data = await graphqlRequest(GET_PRODUTOS_POR_CATEGORIA, { slug: categoriaSlug });
  const categoria = data?.productCategory;
  const produtos = categoria?.products?.nodes || [];

  // Se a categoria não existir no WordPress, joga para a página 404
  if (!categoria) {
    return notFound();
  }

  return (
    <main className="py-12 px-4 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-4xl font-bold mb-10 text-gray-800 capitalize tracking-tight">
        {categoria.name}
      </h1>

      {produtos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-lg">Nenhum produto encontrado nesta categoria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {produtos.map((produto: any) => (
            <Link href={`/produtos/${produto.slug}`} key={produto.id} className="group">
              <div className="border border-gray-100 rounded-lg overflow-hidden bg-white hover:shadow-xl transition-all duration-300">
                <div className="w-full h-64 bg-gray-50 relative">
                  {produto.image?.sourceUrl ? (
                    <Image 
                      src={produto.image.sourceUrl} 
                      alt={produto.image.altText || produto.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      Sem imagem
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-800 truncate text-sm mb-1">{produto.name}</h3>
                  <p className="text-lg font-bold text-gray-900">{produto.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}