import { graphqlRequest } from "@/src/libs/graphqlRequest";
//import Image from "next/image";
import { notFound } from "next/navigation";
import AddToCartButton from "@/src/components/ui/AddToCartButton";
import ProductGallery from "@/src/components/ui/ProductGallery";
import Image from "next/image";

// Query para buscar as informações detalhadas de UM produto específico
const GET_PRODUCT_BY_SLUG = `
  query GetProduct($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      id
      databaseId
      name
      slug
      description
      image {
        sourceUrl
        altText
      }
      galleryImages {
        nodes {
          sourceUrl
          altText
          id
        }
      }
      midiaExtra {
        modelo3d
        videoUrl
      }
      ... on SimpleProduct {
        price
      }
      related(first: 4) {
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

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Busca o produto no WordPress
  const data = await graphqlRequest(GET_PRODUCT_BY_SLUG, { slug });
  const produto = data?.product;

  // Se não achar o produto (slug errado), manda pra página 404
  if (!produto) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-white pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
        {/* Coluna da Esquerda: Imagem do Produto */}
        <div className="w-full">
            <ProductGallery
              mainImage={produto.image}
              gallery={produto.galleryImages?.nodes || []}
              midiaExtra={produto.midiaExtra}
            />
        </div>

        {/* Coluna da Direita: Informações e Compra */}
        <div className="flex flex-col justify-center">
          {/* Breadcrumb (Navegação estrutural) */}
          <div className="text-xs text-gray-400 uppercase tracking-widest mb-6">
            <span className="hover:text-black cursor-pointer transition-colors">
              Início
            </span>
            <span className="mx-2">/</span>
            <span className="text-black">{produto.name}</span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-4 tracking-tight">
            {produto.name}
          </h1>

          <p className="text-xl font-medium text-gray-800 mb-10">
            {produto.price ? produto.price.replace(/&nbsp;/g, ' ') : "Preço sob consulta"}
          </p>

          {/* O nosso Botão Inteligente (Adicionar ao Carrinho ou Modal de Cotação) */}
          <div className="mb-16">
            <AddToCartButton
              produto={{
                id: produto.id,
                name: produto.name,
                price: produto.price,
                image: produto.image?.sourceUrl,
              }}
            />
          </div>

          {/* Descrição Limpa e Padronizada pelo Tailwind Typography */}
          <div className="border-t border-gray-100 pt-10">
            <h3 className="text-sm uppercase tracking-widest text-gray-900 font-semibold mb-6">
              Sobre a peça
            </h3>

            {produto.description ? (
              <div
                // A classe 'prose' aqui é a mágica! Ela formata tudo perfeitamente.
                className="prose prose-sm md:prose-base prose-neutral font-light text-gray-500 leading-relaxed max-w-none"
                dangerouslySetInnerHTML={{ __html: produto.description }}
              />
            ) : (
              <p className="text-gray-500 font-light text-sm">
                Nenhuma descrição adicional cadastrada para este produto.
              </p>
            )}
          </div>
        </div>
      </div>
      {/* SEÇÃO DE PRODUTOS RELACIONADOS */}
      {produto.related?.nodes?.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-32 border-t border-gray-100 pt-20">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-2xl font-light tracking-tight text-gray-900 uppercase">
              Complete o Ambiente
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {produto.related.nodes.map((item: any) => (
              <a href={`/produtos/${item.slug}`} key={item.id} className="group flex flex-col cursor-pointer">
                <div className="w-full aspect-[4/5] bg-gray-50 relative overflow-hidden mb-4">
                  {item.image?.sourceUrl ? (
                    <Image
                      src={item.image.sourceUrl}
                      alt={item.image.altText || item.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
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
                    {item.name}
                  </h3>
                  <p className="text-gray-500 text-xs font-light">
                    {item.price || "Sob Consulta"}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
