import Link from "next/link";
import Image from "next/image";
import { graphqlRequest } from "@/src/lib/graphqlRequest";

// A query GraphQL para puxar 4 produtos do WooCommerce
const GET_PRODUTOS_DESTAQUE = `
  query GetDestaques {
    products(first: 4) {
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
`;

export default async function Destaques() {
  const data = await graphqlRequest(GET_PRODUTOS_DESTAQUE);
  const produtos = data?.products?.nodes || [];

  console.log("Produtos de destaque:", produtos); // Adicione este log para depuração

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Destaques</h2>

      <div className="grid grid-cols-1sm:grid-cols-2 md:grid-cols-4 gap-6">
        {produtos.map((produto: any) => (
          <Link
            href={`/produtos/${produto.slug}`}
            key={produto.id}
            className="group"
          >
            <div className="border rounded-lg overflow-hidden bg-white hover:shadow-lg transition-shadow">
              {/* Usando a tag img padrão por enquanto para evitar erros de configuração de domínio no Next.js na madrugada */}
              {produto.image?.sourceUrl ? (
                <Image src={produto.image.sourceUrl} 
                  alt={produto.image.altText || produto.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  width={250}
                  height={250}
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">Sem imagem</span>
                </div>
              )}

              <div className="p-4">
                <h3 className="font-semibold text-gray-800 truncate">
                  {produto.name}
                </h3>
                <p className="text-lg font-bold mt-2 text-blue-600">
                  {produto.price}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
