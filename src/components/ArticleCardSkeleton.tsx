export default function ArticleCardSkeleton() {
  return (
    <div className="group block">
      <div className="aspect-video bg-surface-container mb-6 overflow-hidden rounded-xl relative">
        <div className="absolute inset-0 bg-gradient-to-r from-surface-container-high via-surface-container-highest to-surface-container-high bg-[length:400%_100%] animate-pulse"></div>
      </div>
      
      <div className="h-6 bg-surface-container-high rounded w-3/4 mb-3 animate-pulse"></div>
      <div className="h-6 bg-surface-container-high rounded w-1/2 mb-5 animate-pulse"></div>
      
      <div className="h-3 bg-surface-container rounded w-full mb-2 animate-pulse"></div>
      <div className="h-3 bg-surface-container rounded w-5/6 mb-6 animate-pulse"></div>
      
      <div className="flex items-center justify-between border-t border-outline-variant/10 pt-4 mt-auto">
        <div className="h-2 bg-surface-container rounded w-16 animate-pulse"></div>
      </div>
    </div>
  );
}
