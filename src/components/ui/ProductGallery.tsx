"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Script from "next/script";
const ModelViewer = "model-viewer" as any;

interface ProductGalleryProps {
  mainImage?: { sourceUrl: string; altText?: string } | null;
  gallery?: { id: string; sourceUrl: string; altText?: string }[] | null;
  midiaExtra?: {
    modelo3d?: string | null;
    videoUrl?: string | null;
  } | null;
}

export default function ProductGallery({
  mainImage,
  gallery,
  midiaExtra,
}: ProductGalleryProps) {
  const rawImages = [mainImage, ...(gallery || [])];
  const allImages = rawImages.filter(
    (img): img is NonNullable<typeof img> =>
      img !== null && img !== undefined && Boolean(img.sourceUrl),
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Estado para controlar a aba ativa: 'fotos', 'video', ou '3d'
  const [activeTab, setActiveTab] = useState<"fotos" | "video" | "3d">("fotos");

  const has3D = Boolean(midiaExtra?.modelo3d);
  const hasVideo = Boolean(midiaExtra?.videoUrl);

  // Função simples para converter link do YouTube comum em link de "embed" (iframe)
  const getEmbedUrl = (url: string) => {
    if (url.includes("youtube.com/watch?v="))
      return url.replace("watch?v=", "embed/");
    if (url.includes("youtu.be/"))
      return url.replace("youtu.be/", "youtube.com/embed/");
    return url;
  };

  if (allImages.length === 0) {
    return (
      <div className="w-full aspect-square md:aspect-[4/5] bg-gray-50 flex items-center justify-center text-gray-300 font-light">
        Imagem não disponível
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Importa o motor 3D do Google silenciosamente por baixo dos panos */}
      <Script
        type="module"
        src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js"
      />

      {/* Abas de Navegação (Só aparece se tiver 3D ou Vídeo) */}
      {(has3D || hasVideo) && (
        <div className="flex gap-6 border-b border-gray-200 pb-2">
          <button
            onClick={() => setActiveTab("fotos")}
            className={`text-xs uppercase tracking-widest font-semibold transition-colors ${activeTab === "fotos" ? "text-black border-b-2 border-black pb-2 -mb-[10px]" : "text-gray-400 hover:text-black"}`}
          >
            Fotos
          </button>

          {hasVideo && (
            <button
              onClick={() => setActiveTab("video")}
              className={`text-xs uppercase tracking-widest font-semibold transition-colors ${activeTab === "video" ? "text-black border-b-2 border-black pb-2 -mb-[10px]" : "text-gray-400 hover:text-black"}`}
            >
              Vídeo
            </button>
          )}

          {has3D && (
            <button
              onClick={() => setActiveTab("3d")}
              className={`text-xs uppercase tracking-widest font-semibold transition-colors flex items-center gap-2 ${activeTab === "3d" ? "text-black border-b-2 border-black pb-2 -mb-[10px]" : "text-gray-400 hover:text-black"}`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
                />
              </svg>
              Ver em 3D
            </button>
          )}
        </div>
      )}

      {/* ÁREA DE VISUALIZAÇÃO PRINCIPAL */}
      <div className="flex flex-col-reverse md:flex-row gap-4">
        {/* Renderiza as miniaturas SOMENTE se estiver na aba de fotos */}
        {activeTab === "fotos" && allImages.length > 1 && (
          <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:w-24 shrink-0 no-scrollbar">
            {allImages.map((img, idx) => (
              <button
                key={img.id || idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative w-20 h-24 shrink-0 overflow-hidden transition-all duration-300 ${
                  currentIndex === idx
                    ? "border border-gray-900 opacity-100"
                    : "opacity-50 hover:opacity-100"
                }`}
              >
                <Image
                  src={img.sourceUrl}
                  alt={img.altText || "Miniatura"}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* CONTAINER DINÂMICO (Troca entre Foto, Vídeo e 3D) */}
        <div className="relative w-full aspect-square md:aspect-[4/5] bg-gray-50 overflow-hidden">
          {/* VISUALIZAÇÃO 1: FOTOS */}
          {activeTab === "fotos" && (
            <div
              className="w-full h-full cursor-zoom-in"
              onClick={() => setIsZoomOpen(true)}
            >
              <Image
                src={allImages[currentIndex].sourceUrl}
                alt={allImages[currentIndex].altText || "Produto"}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute bottom-4 right-4 bg-white/80 px-3 py-1 text-[10px] uppercase tracking-widest text-gray-900 backdrop-blur-sm">
                Ampliar
              </div>
            </div>
          )}

          {/* VISUALIZAÇÃO 2: VÍDEO */}
          {activeTab === "video" && midiaExtra?.videoUrl && (
            <iframe
              src={getEmbedUrl(midiaExtra.videoUrl)}
              className="w-full h-full"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          )}
          {/* VISUALIZAÇÃO 3: MODELO 3D (Realidade Aumentada) */}
          {activeTab === "3d" && midiaExtra?.modelo3d && (
            <ModelViewer
              src={midiaExtra.modelo3d}
              ar="true"
              camera-controls="true"
              auto-rotate="true"
              shadow-intensity="1"
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#f9fafb",
              }}
            >
              {/* Botão nativo que aparece no celular para ativar a câmera */}
              <button
                slot="ar-button"
                className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 uppercase tracking-widest text-xs font-semibold rounded-full shadow-xl"
              >
                Projetar na minha sala
              </button>
            </ModelViewer>
          )}
        </div>
      </div>

      {/* Modal de Zoom (Lightbox) */}
      <AnimatePresence>
        {isZoomOpen && activeTab === "fotos" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
            onClick={() => setIsZoomOpen(false)}
          >
            <div className="relative w-full h-full">
              <Image
                src={allImages[currentIndex].sourceUrl}
                alt="Zoom"
                fill
                className="object-contain"
                quality={100}
              />
            </div>
            <button className="absolute top-8 right-8 text-black uppercase tracking-widest text-xs font-semibold pb-1 border-b border-black hover:text-gray-500 hover:border-gray-500 transition-colors">
              Fechar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
