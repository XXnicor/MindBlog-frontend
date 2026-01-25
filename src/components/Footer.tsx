import React from 'react'
import { Twitter, Github, Linkedin } from 'lucide-react'

export default function Footer(){
  return (
    <footer className="bg-slate-950 text-slate-400 mt-12 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-white font-bold">&lt;M/&gt; — Seu portal de tecnologia</div>
        <nav className="flex gap-6">
          <a href="#" className="hover:text-white">Home</a>
          <a href="#" className="hover:text-white">Artigos</a>
          <a href="#" className="hover:text-white">Dashboard</a>
        </nav>
        <div className="flex items-center gap-4">
          <a href="#" className="text-slate-400 hover:text-white"><Twitter size={18} /></a>
          <a href="#" className="text-slate-400 hover:text-white"><Github size={18} /></a>
          <a href="#" className="text-slate-400 hover:text-white"><Linkedin size={18} /></a>
        </div>
      </div>
      <div className="border-t border-slate-800 text-center text-sm text-slate-600 py-6">© 2025 TechBlog. Todos os direitos reservados.</div>
    </footer>
  )
}

