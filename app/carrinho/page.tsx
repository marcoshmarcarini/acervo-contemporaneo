"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/src/store/useCartStore";
import { motion } from "framer-motion";

export default function CarrinhoPage() {
  const { items, removeItem, clearCart } = useCartStore();

  //Converter a string em um número
  const parsePrice = (priceStr: string) => {
    if (!priceStr) return 0;
    //Remove tudo que não for número, depois troca a vírgula por ponto.
    const cleanString = priceStr.replace(/[^\d.,]/g, "").replace(",", ".");
    return parseFloat(cleanString) || 0;
  };

  //Calcula o valor total do pedido
  const total = items.reduce((acc, item) => {
    return acc + parsePrice(item.price) * item.quantity;
  }, 0);

  //Formata o total de volta para o padrão brasieleiro
  const totalFormatado = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(total);

  // Tela de Carrinho Vazio
  if (items.length === 0) {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-10 rounded-lg shadow-sm text-center max-w-md w-full">
          <svg className="w-20 h-20 mx-auto text-gray-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Seu carrinho está vazio</h1>
          <p className="text-gray-500 mb-8">Parece que você ainda não adicionou nada ao seu carrinho.</p>
          <Link href="/" className="bg-gray-900 text-white font-bold py-3 px-8 rounded hover:bg-gray-700 transition-colors inline-block w-full">
            Continuar Comprando
          </Link>
        </div>
      </main>
    );
  }

  // Tela do Carrinho com Produtos
  return (
    <main className="py-12 px-4 max-w-7xl mx-auto min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 tracking-tight">Meu Carrinho</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Lista de Produtos (Esquerda) */}
        <div className="lg:w-2/3 space-y-4">
          {items.map((item, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={item.id} 
              className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-6 border border-gray-100"
            >
              {/* Imagem */}
              <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 relative">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Sem foto</div>
                )}
              </div>

              {/* Informações */}
              <div className="flex-1">
                <Link href={`/produtos/${item.id}`} className="font-bold text-gray-800 hover:text-blue-600 text-lg line-clamp-1">
                  {item.name}
                </Link>
                <div className="text-gray-500 mt-1">Quantidade: <span className="font-semibold text-gray-800">{item.quantity}</span></div>
                <div className="font-bold text-gray-900 mt-2">{item.price}</div>
              </div>

              {/* Botão Remover */}
              <button 
                onClick={() => removeItem(item.id)}
                className="p-2 text-red-400 hover:text-red-600 transition-colors focus:outline-none"
                title="Remover produto"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Resumo do Pedido (Direita) */}
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-28">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Resumo do Pedido</h2>
            
            <div className="flex justify-between text-gray-600 mb-4">
              <span>Subtotal</span>
              <span>{totalFormatado}</span>
            </div>
            
            <div className="flex justify-between text-gray-600 mb-6 pb-6 border-b border-gray-100">
              <span>Frete</span>
              <span className="text-sm">Calculado na próxima etapa</span>
            </div>
            
            <div className="flex justify-between text-xl font-bold text-gray-900 mb-8">
              <span>Total</span>
              <span>{totalFormatado}</span>
            </div>

            <button className="w-full bg-green-600 text-white font-bold py-4 px-4 rounded hover:bg-green-700 transition-colors mb-4">
              Finalizar Compra
            </button>
            
            <button 
              onClick={clearCart}
              className="w-full text-sm text-gray-500 hover:text-red-500 font-semibold transition-colors py-2"
            >
              Esvaziar carrinho
            </button>
          </div>
        </div>
      </div>
    </main>
  );

}
