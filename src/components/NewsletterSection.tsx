import { useState } from 'react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  
  return (
    <section className="max-w-5xl mx-auto px-6 mb-24">
      <div className="bg-surface-container-highest p-12 md:p-20 rounded-xl relative overflow-hidden text-center">
        <div className="absolute inset-0 blueprint-grid opacity-10 pointer-events-none"></div>
        
        <div className="relative z-10">
          <span className="font-label text-[10px] uppercase tracking-[0.4em] text-primary font-bold mb-6 block">The Weekly Ledger</span>
          <h2 className="font-headline text-4xl md:text-5xl font-bold text-on-surface mb-8">Engineering insights, delivered with editorial rigor.</h2>
          
          <form 
            className="max-w-md mx-auto flex flex-col md:flex-row gap-4" 
            onSubmit={(e) => { e.preventDefault(); setEmail(''); alert('Subscribed successfully!'); }}
          >
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@engineer-mail.com" 
              className="flex-1 bg-surface-container-lowest border-none px-6 py-4 font-label text-sm focus:ring-1 focus:ring-primary rounded-lg shadow-sm"
              required
            />
            <button 
              type="submit" 
              className="bg-primary text-on-primary font-label text-sm font-bold px-8 py-4 rounded-lg hover:bg-primary-container transition-colors shadow-lg"
            >
              SUBSCRIBE
            </button>
          </form>
          
          <p className="mt-8 font-body text-xs text-secondary opacity-60">
            Join 45,000+ senior engineers and architects. No spam, just deep dives.
          </p>
        </div>
      </div>
    </section>
  );
}
