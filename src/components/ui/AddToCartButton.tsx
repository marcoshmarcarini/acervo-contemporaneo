"use client";

import { useState } from "react";
import { useCartStore } from "@/src/store/useCartStore";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

interface ProductActionsProps {
  produto: {
    id: string;
    databaseId?: number | string;
    name: string;
    price: string | null;
    image?: string;
  };
}

export default function AddToCartButton({ produto }: ProductActionsProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  
  // Estados para capturar os dados digitados
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [isSending, setIsSending] = useState(false);

  const hasValidPrice = produto.price && produto.price !== "" && produto.price !== "R$ 0,00" && produto.price !== "0,00";

  const handleAddToCart = () => {
    addItem({
      id: produto.id,
      databaseId: produto.databaseId,
      name: produto.name,
      price: produto.price!,
      image: produto.image,
      quantity: 1,
    });
  };

  const meuEmail = "marcoshmarcarini@hotmail.com"

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      // Substitua pelo e-mail do Geovanni ou o seu para testar amanhã
      const response = await fetch(`https://formsubmit.co/ajax/${meuEmail}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          Assunto: `Nova Cotação: ${produto.name}`,
          Produto: produto.name,
          Nome: nome,
          Email: email,
          Telefone: telefone,
          Mensagem: mensagem || "Sem mensagem adicional."
        })
      });

      if (response.ok) {
        alert("Cotação enviada com sucesso! O Geovanni já recebeu o lead.");
        setIsQuoteModalOpen(false);
        setNome(""); setEmail(""); setTelefone(""); setMensagem("");
      } else {
        alert("Erro ao enviar. Tente novamente.");
      }
    } catch (error) {
      alert("Erro de conexão. Verifique sua internet.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {hasValidPrice ? (
        <button onClick={handleAddToCart} className="w-full bg-gray-900 text-white font-semibold py-4 px-8 tracking-widest uppercase text-sm hover:bg-gray-800 transition-colors">
          Adicionar à Sacola
        </button>
      ) : (
        <button onClick={() => setIsQuoteModalOpen(true)} className="w-full bg-black text-white font-semibold py-4 px-8 tracking-widest uppercase text-sm hover:bg-gray-800 transition-colors">
          Preço Sob Consulta
        </button>
      )}

      <AnimatePresence>
        {isQuoteModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white max-w-lg w-full p-8 relative shadow-2xl">
              <button onClick={() => setIsQuoteModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <h2 className="text-2xl font-light tracking-tight text-gray-900 mb-6">Solicitar Cotação</h2>
              
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
                {produto.image && (
                  <div className="w-16 h-16 relative bg-gray-50 flex-shrink-0">
                    <Image src={produto.image} alt={produto.name} fill className="object-cover" />
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Produto selecionado</p>
                  <p className="font-semibold text-gray-900">{produto.name}</p>
                </div>
              </div>

              <form onSubmit={handleQuoteSubmit} className="space-y-4">
                <input required type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome completo" className="w-full border-b border-gray-300 py-3 focus:outline-none focus:border-black transition-colors text-sm" />
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" className="w-full border-b border-gray-300 py-3 focus:outline-none focus:border-black transition-colors text-sm" />
                <input required type="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="Telefone / WhatsApp" className="w-full border-b border-gray-300 py-3 focus:outline-none focus:border-black transition-colors text-sm" />
                <textarea rows={3} value={mensagem} onChange={(e) => setMensagem(e.target.value)} placeholder="Mensagem (Opcional)" className="w-full border-b border-gray-300 py-3 focus:outline-none focus:border-black transition-colors text-sm resize-none"></textarea>
                
                <button type="submit" disabled={isSending} className="w-full bg-black text-white font-semibold py-4 uppercase tracking-widest text-sm mt-4 hover:bg-gray-800 transition-colors disabled:opacity-50">
                  {isSending ? "Enviando..." : "Enviar Solicitação"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}