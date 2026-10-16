import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-20 pb-10 px-4 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-gray-800 pb-16 mb-8">
        
        {/* Coluna 1 - Marca */}
        <div className="md:col-span-1">
          <Link href="/" className="text-2xl font-bold tracking-tighter block mb-6">
            ACERVO
          </Link>
          <p className="text-gray-400 text-sm font-light leading-relaxed">
            Curadoria de design brasileiro contemporâneo. Peças exclusivas que transformam a função em sentimento e o cotidiano em arte.
          </p>
        </div>

        {/* Coluna 2 - Navegação */}
        <div>
          <h4 className="text-xs font-semibold tracking-widest uppercase mb-6 text-gray-300">Loja</h4>
          <ul className="space-y-4 text-sm font-light text-gray-400">
            <li><Link href="/categoria/mobiliario" className="hover:text-white transition-colors">Mobiliário</Link></li>
            <li><Link href="/categoria/iluminacao" className="hover:text-white transition-colors">Iluminação</Link></li>
            <li><Link href="/categoria/decoracao" className="hover:text-white transition-colors">Decoração</Link></li>
            <li><Link href="/designers" className="hover:text-white transition-colors">Designers</Link></li>
          </ul>
        </div>

        {/* Coluna 3 - Atendimento */}
        <div>
          <h4 className="text-xs font-semibold tracking-widest uppercase mb-6 text-gray-300">Atendimento</h4>
          <ul className="space-y-4 text-sm font-light text-gray-400">
            <li><Link href="/contato" className="hover:text-white transition-colors">Fale Conosco</Link></li>
            <li><Link href="/trocas" className="hover:text-white transition-colors">Trocas e Devoluções</Link></li>
            <li><Link href="/prazos" className="hover:text-white transition-colors">Prazos de Entrega</Link></li>
            <li><Link href="/faq" className="hover:text-white transition-colors">Perguntas Frequentes</Link></li>
          </ul>
        </div>

        {/* Coluna 4 - Newsletter */}
        <div>
          <h4 className="text-xs font-semibold tracking-widest uppercase mb-6 text-gray-300">Newsletter</h4>
          <p className="text-sm font-light text-gray-400 mb-4">
            Receba convites para lançamentos e eventos exclusivos.
          </p>
          <form className="flex border-b border-gray-700 pb-2">
            <input 
              type="email" 
              placeholder="Seu endereço de e-mail" 
              className="bg-transparent w-full focus:outline-none text-sm font-light placeholder-gray-600"
            />
            <button type="submit" className="text-xs tracking-widest uppercase font-semibold hover:text-gray-300 transition-colors">
              Assinar
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 font-light">
        <p>&copy; {new Date().getFullYear()} Acervo Contemporâneo. Todos os direitos reservados.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-white transition-colors">Instagram</a>
          <a href="#" className="hover:text-white transition-colors">Pinterest</a>
        </div>
      </div>
    </footer>
  );
}