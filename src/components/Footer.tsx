import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-stone-100 dark:bg-stone-900 py-16 px-8 border-t border-stone-200/20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand */}
        <div>
          <span className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-4 block font-headline">MindBlog</span>
          <p className="font-headline text-stone-600 dark:text-stone-400 leading-relaxed max-w-xs mb-8">
            The intersection of software engineering, artificial intelligence, and structural design culture.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-stone-400 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">alternate_email</span>
            </a>
            <a href="#" className="text-stone-400 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">language</span>
            </a>
          </div>
        </div>
        
        {/* Deep Dives */}
        <div>
          <h4 className="font-label text-xs font-bold uppercase tracking-widest text-on-surface mb-6">Deep Dives</h4>
          <ul className="space-y-4 font-headline text-lg">
            <li><Link to="/categorias?tipo=AI" className="text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors">AI Research</Link></li>
            <li><Link to="/categorias?tipo=Architecture" className="text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors">System Architecture</Link></li>
            <li><Link to="/categorias?tipo=Engineering" className="text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors">Engineering Culture</Link></li>
          </ul>
        </div>
        
        {/* Journal */}
        <div>
          <h4 className="font-label text-xs font-bold uppercase tracking-widest text-on-surface mb-6">Journal</h4>
          <ul className="space-y-4 font-headline text-lg mb-8">
            <li><Link to="/" className="text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors">Privacy Policy</Link></li>
            <li><Link to="/" className="text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors">Terms of Service</Link></li>
          </ul>
          <p className="pt-4 text-xs font-label text-stone-400 border-t border-stone-200/50 dark:border-stone-800">
            © {new Date().getFullYear()} MindBlog Editorial. Built for Engineers.
          </p>
        </div>
      </div>
    </footer>
  );
}
