import React from 'react';
import { Twitter, Github, Linkedin, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-paper border-t border-border mt-20 pt-20 pb-10">
      <div className="max-w-[1080px] mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-16 border-b border-border pb-16">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link to="/" className="font-display text-3xl font-bold text-ink tracking-tight mb-4">
              Mind<span className="text-accent italic">Blog</span>.
            </Link>
            <p className="font-body text-[15px] text-ink-light max-w-[300px] leading-relaxed">
              Um espaço de pensamento independente onde ideias ganham forma escrita e ecoam para sempre.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-12 sm:gap-20">
            <nav className="flex flex-col items-center md:items-start gap-4">
              <span className="font-body text-[11px] font-bold text-ink-muted uppercase tracking-widest mb-2">Plataforma</span>
              <Link to="/" className="font-body text-[14px] font-medium text-ink hover:text-accent transition-colors flex items-center gap-1 group">
                Explorar <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-1 group-hover:ml-0" />
              </Link>
              <Link to="/artigos/novo" className="font-body text-[14px] font-medium text-ink hover:text-accent transition-colors flex items-center gap-1 group">
                Publicar <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-1 group-hover:ml-0" />
              </Link>
              <Link to="/dashboard" className="font-body text-[14px] font-medium text-ink hover:text-accent transition-colors flex items-center gap-1 group">
                Meu Espaço <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-1 group-hover:ml-0" />
              </Link>
            </nav>

            <div className="flex flex-col items-center md:items-start gap-4">
              <span className="font-body text-[11px] font-bold text-ink-muted uppercase tracking-widest mb-2">Conectar</span>
              <a href="#" className="font-body text-[14px] font-medium text-ink hover:text-accent transition-colors flex items-center gap-2">
                <Twitter size={16} /> Twitter
              </a>
              <a href="#" className="font-body text-[14px] font-medium text-ink hover:text-accent transition-colors flex items-center gap-2">
                <Github size={16} /> GitHub
              </a>
              <a href="#" className="font-body text-[14px] font-medium text-ink hover:text-accent transition-colors flex items-center gap-2">
                <Linkedin size={16} /> LinkedIn
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-body text-[13px] text-ink-muted">
          <p>© {new Date().getFullYear()} MindBlog. Todos os direitos reservados.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-ink transition-colors">Privacidade</a>
            <a href="#" className="hover:text-ink transition-colors">Termos</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
