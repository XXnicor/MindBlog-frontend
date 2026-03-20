export default function AuthLeftPanel() {
  return (
    <section className="hidden md:flex relative w-1/2 bg-surface-container-low items-center justify-center overflow-hidden">
      {/* Blueprint texture overlay */}
      <div className="absolute inset-0 blueprint-grid"></div>
      
      {/* Abstract Neural/Circuit Pattern */}
      <div className="relative z-10 w-full max-w-lg p-12">
        <div className="space-y-8">
          <div className="inline-block">
            <span className="font-headline text-5xl font-bold tracking-tight text-on-surface">
              MindBlog<span className="text-primary">.</span>
            </span>
          </div>
          
          <div className="relative h-96 w-full border-l border-b border-outline-variant/30 flex items-end p-8">
            <div className="absolute top-0 right-0 w-32 h-32 border-t border-r border-outline-variant/30"></div>
            
            <svg className="w-full h-full opacity-40 text-primary" viewBox="0 0 400 300">
              <circle cx="50" cy="150" fill="currentColor" r="4"></circle>
              <circle cx="150" cy="80" fill="currentColor" r="4"></circle>
              <circle cx="150" cy="220" fill="currentColor" r="4"></circle>
              <circle cx="250" cy="50" fill="currentColor" r="4"></circle>
              <circle cx="250" cy="150" fill="currentColor" r="4"></circle>
              <circle cx="250" cy="250" fill="currentColor" r="4"></circle>
              <circle cx="350" cy="150" fill="currentColor" r="4"></circle>
              <path d="M50 150 L150 80 M50 150 L150 220 M150 80 L250 50 M150 80 L250 150 M150 220 L250 150 M150 220 L250 250 M250 50 L350 150 M250 150 L350 150 M250 250 L350 150" fill="none" stroke="currentColor" strokeWidth="0.5"></path>
            </svg>
            
            <div className="absolute bottom-12 left-0 pl-12 max-w-xs">
              <p className="font-headline italic text-3xl leading-snug text-on-surface-variant">
                "Where engineering minds find their voice."
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 pt-4">
            <div className="h-1 w-12 bg-primary"></div>
            <div className="h-1 w-4 bg-outline-variant"></div>
            <div className="h-1 w-2 bg-outline-variant"></div>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-primary/5 blur-3xl"></div>
      <div className="absolute top-12 right-12 font-mono text-[10px] text-tertiary tracking-[0.2em] opacity-30" style={{ writingMode: 'vertical-rl' }}>
        SYSTEM_ACCESS // VER_2024.01
      </div>

      <div className="fixed top-6 left-6 pointer-events-none z-20">
        <span className="font-mono text-[9px] text-tertiary/40 leading-none">
          NODE_01 // SECURE_SOCKET_LAYER<br/>
          ENCRYPTION: AES_256_GCM
        </span>
      </div>
      <div className="fixed bottom-6 left-6 pointer-events-none z-20">
        <div className="flex items-center space-x-4">
          <span className="font-label text-[10px] text-on-surface-variant/40 tracking-[0.3em] uppercase">MindBlog Editorial</span>
          <div className="h-[1px] w-8 bg-outline-variant/30"></div>
        </div>
      </div>
    </section>
  );
}
