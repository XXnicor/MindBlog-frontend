import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-surface-container-high py-16 px-8 border-t border-outline-variant/20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand */}
        <div>
          <span className="text-xl font-bold text-on-surface mb-4 block font-headline">MindBlog</span>
          <p className="font-headline text-secondary leading-relaxed max-w-xs mb-8">
            A interseção entre engenharia de software, inteligência artificial e cultura de design estrutural.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-secondary hover:text-primary transition-colors">
              <span className="material-symbols-outlined">alternate_email</span>
            </a>
            <a href="#" className="text-secondary hover:text-primary transition-colors">
              <span className="material-symbols-outlined">language</span>
            </a>
          </div>
        </div>
        
        {/* Deep Dives */}
        <div>
          <h4 className="font-label text-xs font-bold uppercase tracking-widest text-on-surface mb-6">Explorar</h4>
          <ul className="space-y-4 font-headline text-lg">
            <li><Link to="/categorias?tipo=AI" className="text-secondary hover:text-on-surface transition-colors">Pesquisa em IA</Link></li>
            <li><Link to="/categorias?tipo=Architecture" className="text-secondary hover:text-on-surface transition-colors">Arquitetura de Sistemas</Link></li>
            <li><Link to="/categorias?tipo=Engineering" className="text-secondary hover:text-on-surface transition-colors">Cultura de Engenharia</Link></li>
          </ul>
        </div>
        
        {/* Journal */}
        <div>
          <h4 className="font-label text-xs font-bold uppercase tracking-widest text-on-surface mb-6">Links</h4>
          <ul className="space-y-4 font-headline text-lg mb-8">
            <li><Link to="/" className="text-secondary hover:text-on-surface transition-colors">Política de Privacidade</Link></li>
            <li><Link to="/" className="text-secondary hover:text-on-surface transition-colors">Termos de Serviço</Link></li>
          </ul>
          <p className="pt-4 text-xs font-label text-secondary border-t border-outline-variant/50">
            © {new Date().getFullYear()} MindBlog Editorial. Feito para Engenheiros.
          </p>
        </div>
      </div>
    </footer>
  );
}
