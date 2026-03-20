interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`bg-slate-800 animate-pulse rounded ${className}`} />
  );
}

export function ArticleCardSkeleton() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
      {/* Imagem */}
      <Skeleton className="h-48 w-full" />
      
      {/* Conteúdo */}
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        
        {/* Meta info */}
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-4 w-1/3" />
          <div className="flex gap-3">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ArticleListItemSkeleton() {
  return (
    <div className="flex gap-4 p-4 bg-slate-950 border border-slate-800 rounded-lg">
      {/* Imagem */}
      <Skeleton className="w-24 h-24 rounded-lg flex-shrink-0" />
      
      {/* Conteúdo */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        
        {/* Meta */}
        <div className="flex items-center gap-4 pt-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-4 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function DashboardCardSkeleton() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
      <div className="flex items-start justify-between mb-3">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="w-6 h-6 rounded" />
      </div>
      <Skeleton className="h-8 w-3/4" />
    </div>
  );
}