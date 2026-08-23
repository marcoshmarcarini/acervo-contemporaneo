import { graphqlRequest } from "@/src/lib/graphqlRequest";
import Image from "next/image";
import { notFound } from "next/navigation";

// Query para puxar um produto específico pelo slug
const GET_PRODUTO = `
  query GetProduto($id: ID!) {
    product(id: $id, idType: SLUG) {
      id
      name
      description
      image {
        sourceUrl
        altText
      }
      ... on SimpleProduct {
        price
      }
    }
  }
`;

// 1. Atualizamos a tipagem para indicar que params é uma Promise
export default async function ProdutoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // 2. Colocamos o await aqui antes de extrair o slug!
  const { slug } = await params;

  const data = await graphqlRequest(GET_PRODUTO, { id: slug });
  const produto = data?.product;

  if (!produto) {
    return notFound();
  }

  return (
    <main className="py-12 px-4 max-w-6xl mx-auto min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
        {/* Área da Imagem */}
        <div className="md:w-1/2">
          {produto.image?.sourceUrl ? (
            <Image
              src={produto.image.sourceUrl}
              alt={produto.image.altText || produto.name}
              width={600}
              height={600}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-[500px] bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-lg">Sem imagem</span>
            </div>
          )}
        </div>

        {/* Área de Informações */}
        <div className="p-8 md:w-1/2 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {produto.name}
          </h1>
          <p className="text-2xl text-blue-600 font-semibold mb-6">
            {produto.price}
          </p>

          {/* O WooCommerce manda a descrição em HTML, então precisamos usar o dangerouslySetInnerHTML */}
          <div
            className="prose prose-sm text-gray-600 mb-8"
            dangerouslySetInnerHTML={{
              __html:
                produto.description || "<p>Nenhuma descrição disponível.</p>",
            }}
          />

          {/* Botão preparado para o Zustand */}
          <button className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors w-full md:w-auto">
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </main>
  );
}
