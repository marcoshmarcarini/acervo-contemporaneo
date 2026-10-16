"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { menuLinks } from "@/src/libs/menuLinks";
import { motion, AnimatePresence } from "framer-motion";
import CartDrawer from "@/src/components/ui/CartDrawer";
import { useCartStore } from "@/src/store/useCartStore";

export default function Header() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  // Verifica se estamos na página Home
  const isHome = pathname === "/";

  // Lógica para detectar se o usuário rolou a página
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Define se o Header deve ser transparente ou sólido
  const isTransparent = isHome && !isScrolled;

  // Classes dinâmicas para as cores dos textos e ícones
  const textColorClass = isTransparent
    ? "text-white hover:text-gray-200"
    : "text-gray-800 hover:text-gray-500";
  const logoColorClass = isTransparent ? "text-white" : "text-gray-900";
  const bgColorClass = isTransparent
    ? "bg-transparent"
    : "bg-white border-b border-gray-100 shadow-sm";
  const subMenuBgClass = isTransparent
    ? "bg-black/90 border-gray-800 text-white"
    : "bg-white border-gray-100 text-gray-500";

  return (
    <>
      {/* 1. O HEADER ENGLOBA O MENU DESKTOP E O MENU MOBILE */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${bgColorClass}`}
      >
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-20">
          {/* Logo */}
          <Link
            href="/"
            className={`text-2xl font-bold tracking-tighter transition-colors ${logoColorClass}`}
          >
            ACERVO
          </Link>

          {/* Menu Desktop */}
          <nav className="hidden lg:flex space-x-6">
            {menuLinks.map((item) => (
              <div key={item.label} className="relative group">
                <Link
                  href={item.href}
                  className={`font-medium py-6 block transition-colors ${textColorClass}`}
                >
                  {item.label}
                </Link>

                {/* SubMenu Desktop */}
                {item.subMenu && (
                  <div
                    className={`absolute left-0 top-full w-56 border shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 ${subMenuBgClass}`}
                  >
                    {item.subMenu.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        className={`block px-4 py-3 text-sm transition-colors ${isTransparent ? "hover:bg-white/10 hover:text-white" : "hover:bg-gray-50 hover:text-gray-900"}`}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Ações (Direita) */}
          <div className="flex items-center space-x-5">
            {/* Botão de Pesquisa */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`p-1 transition-colors focus:outline-none ${textColorClass}`}
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-1 transition-colors ${textColorClass}`}
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>

            {/* Carrinho */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center"
            >
              {/* Seu ícone de sacola/carrinho aqui */}
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>

              {/* Bolinha com a quantidade (opcional) */}
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full">
                  {items.length}
                </span>
              )}
            </button>

            {/* Cadastre-se / Entrar */}
            <Link
              href="/minha-conta"
              className={`hidden lg:block text-[10px] font-bold tracking-widest text-right leading-tight ml-2 transition-colors ${textColorClass}`}
            >
              CADASTRE-SE
              <br />
              ENTRAR
            </Link>

            {/* Botão Mobile */}
            <button
              className={`p-2 lg:hidden focus:outline-none ml-2 ${textColorClass}`}
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Menu Mobile (AGORA DENTRO DO HEADER PRINCIPAL) */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
                <Link
                  href="/minha-conta"
                  className="block text-gray-800 font-bold text-sm pb-4 border-b border-gray-100"
                  onClick={() => setIsMobileOpen(false)}
                >
                  CADASTRE-SE / ENTRAR
                </Link>

                {menuLinks.map((item) => (
                  <div key={item.label}>
                    <Link
                      href={item.href}
                      className="block text-gray-800 font-semibold text-lg"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                    {item.subMenu && (
                      <div className="mt-2 pl-4 border-l-2 border-gray-100 space-y-2">
                        {item.subMenu.map((sub) => (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            className="block text-gray-500 text-sm py-1"
                            onClick={() => setIsMobileOpen(false)}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
      {/* FINAL DO HEADER PRINCIPAL */}

      {/* 2. O MODAL DE PESQUISA FICA DE FORA, SOLTO NA TELA */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 bg-white/90 backdrop-blur-sm"
          >
            <div className="bg-white border border-gray-200 shadow-2xl rounded-lg p-6 w-full max-w-2xl relative">
              <button
                onClick={() => setIsSearchOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 focus:outline-none"
              >
                <svg
                  className="w-6 h-6"
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

              <h2 className="text-xl font-bold text-gray-800 mb-4">
                O que você está procurando?
              </h2>

              <form
                className="flex"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchTerm.trim()) {
                    router.push(`/busca?q=${searchTerm}`);
                    setIsSearchOpen(false); // Fecha o modal após buscar
                    setSearchTerm(""); // Limpa o campo
                  }
                }}
              >
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Pesquisar produtos, designers..."
                  className="flex-1 border-b-2 border-gray-300 py-2 px-4 focus:outline-none focus:border-gray-800 text-lg transition-colors text-black"
                  autoFocus
                />
                <button
                  type="submit"
                  className="ml-4 bg-gray-900 text-white px-6 py-2 rounded font-bold hover:bg-gray-700 transition-colors"
                >
                  Buscar
                </button>
              </form>
            </div>

            <div
              className="absolute inset-0 -z-10"
              onClick={() => setIsSearchOpen(false)}
            ></div>
          </motion.div>
        )}
      </AnimatePresence>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
