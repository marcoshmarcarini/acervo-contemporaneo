import {graphqlRequest} from "@/src/libs/graphqlRequest";
import Image from "next/image";
import Link from "next/link";

const SEARCH_PRODUCTS = `
    query SearchProducts($term: String!) {
        products(where: {search: $term}, first: 24){
            nodes{
                id
                name
                slug
                image{
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

interface ProdutoBusca {
  id: string;
  name: string;
  slug: string;
  price?: string | null;
  image?: {
    sourceUrl: string;
    altText?: string;
  } | null;
}

export default async function BuscaPage({searchParams}: {searchParams: Promise<{q?: string}>}) {
    //Extrai o parâmetro de busca da query string (ex: /busca?q=termo)
    const {q} = await searchParams;
    const termo = q || '';

    let produtos = [];
    // Só faz a requisição se houver um termo pesquisado
    if (termo){
        const data = await graphqlRequest(SEARCH_PRODUCTS, {term: termo}); 
        produtos = data?.products?.nodes || [];
    }

    return (
    <main className="py-24 px-4 max-w-7xl mx-auto min-h-screen bg-white">
      <div className="mb-16">
        <h1 className="text-3xl font-light text-gray-900 tracking-[0.1em] uppercase mb-4">
          Resultados da Busca
        </h1>
        <p className="text-gray-500">
          Mostrando resultados para: <span className="font-semibold text-gray-900">{`"${termo}"`}</span>
        </p>
      </div>

      {produtos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-gray-50 rounded-lg">
          <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-lg font-light">Não encontramos nenhum produto com esse termo.</p>
          <Link href="/" className="mt-6 border-b border-gray-900 text-gray-900 hover:text-gray-500 transition-colors uppercase text-xs tracking-widest font-semibold pb-1">
            Voltar para a página inicial
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {produtos.map((produto: ProdutoBusca) => (
            <Link href={`/produtos/${produto.slug}`} key={produto.id} className="group flex flex-col cursor-pointer">
              <div className="w-full aspect-[4/5] bg-gray-50 relative overflow-hidden mb-4">
                {produto.image?.sourceUrl ? (
                  <Image
                    src={produto.image.sourceUrl}
                    alt={produto.image.altText || produto.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm font-light">
                    Sem imagem
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xs font-medium text-gray-900 uppercase tracking-widest mb-1 line-clamp-1">
                  {produto.name}
                </h3>
                <p className="text-gray-500 text-xs font-light">
                  {produto.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
