"use client";

import { useCartStore } from "@/src/store/useCartStore";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  // Puxando itens e funções do Zustand (incluindo updateQuantity)
  const { items, removeItem, updateQuantity } = useCartStore();

  // Função segura para somar o valor total (multiplicando pelo número de itens)
  const subtotal = items.reduce((acc, item) => {
    if (!item.price) return acc;

    const precoString = String(item.price);
    const precoLimpo = Number(
      precoString.replace(/[^0-9,]/g, "").replace(",", ".")
    );

    if (isNaN(precoLimpo)) return acc;

    return acc + precoLimpo * item.quantity;
  }, 0);

// Função para extrair o ID numérico puro do produto
  const getNumericId = (item: any): string => {
    if (item.databaseId) return String(item.databaseId);
    if (!isNaN(Number(item.id))) return String(item.id);

    try {
      // Decodifica a string Base64 do GraphQL (ex: "post:45" -> extrai 45)
      const decoded = atob(item.id);
      const match = decoded.match(/\d+/);
      if (match) return match[0];
    } catch (e) {
      console.error("Erro ao decodificar ID:", e);
    }
    return item.id;
  };

  const handleCheckout = () => {
    if (items.length === 0) return;

    const WOOCOMMERCE_URL = "http://localhost:8080";
    const firstItem = items[0];

    // Pega o ID numérico extraído com sucesso
    const productId = getNumericId(firstItem);

    // Apontamos diretamente para a página de checkout do WooCommerce com o ID numérico:
    const checkoutUrl = `${WOOCOMMERCE_URL}/finalizar-compra/?add-to-cart=${productId}&quantity=${firstItem.quantity}`;

    window.location.href = checkoutUrl;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Fundo Escuro (Overlay) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
          />

          {/* Gaveta Lateral */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[210] flex flex-col"
          >
            {/* Cabeçalho */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-900">
                Sua Escolha ({items.reduce((acc, item) => acc + item.quantity, 0)})
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-black transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Lista de Produtos */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-gray-500 font-light mb-6">
                    Sua sacola está vazia.
                  </p>
                  <button
                    onClick={onClose}
                    className="border-b border-black text-xs font-semibold uppercase tracking-widest pb-1 hover:text-gray-600 transition-colors"
                  >
                    Continuar Explorando
                  </button>
                </div>
              ) : (
                <ul className="space-y-8">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-4">
                      {/* Imagem do Item */}
                      <div className="w-20 h-24 relative bg-gray-50 flex-shrink-0">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
                            Sem foto
                          </div>
                        )}
                      </div>

                      {/* Informações e Seletor de Quantidade */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <h3 className="text-xs font-medium uppercase tracking-widest text-gray-900 line-clamp-2 mb-1">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500 font-light">
                            {item.price ? item.price.replace(/&nbsp;/g, ' ') : "Sob consulta"}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          {/* Controles de Incremento e Decremento */}
                          <div className="flex items-center border border-gray-200 rounded">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-100 transition-colors"
                              title="Diminuir quantidade"
                            >
                              -
                            </button>
                            <span className="px-3 text-xs font-medium text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-100 transition-colors"
                              title="Aumentar quantidade"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Rodapé do Carrinho */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 p-6 bg-gray-50">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm uppercase tracking-widest text-gray-500">
                    Subtotal
                  </span>
                  <span className="text-lg font-medium text-gray-900">
                    {subtotal.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>

                <p className="text-xs text-gray-400 mb-6 font-light">
                  Frete e prazos serão calculados na próxima etapa.
                </p>

                <button
                  className="w-full bg-black text-white py-4 text-xs font-semibold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                  onClick={handleCheckout}
                >
                  Finalizar Compra
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}