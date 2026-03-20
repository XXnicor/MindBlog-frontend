interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`skeleton ${className}`} />
  );
}

export function ArticleCardSkeleton() {
  return (
    <div className="bg-transparent border border-transparent rounded-2xl overflow-hidden flex flex-col">
      {/* Imagem */}
      <Skeleton className="w-full aspect-video rounded-xl" />
      
      {/* Conteúdo */}
      <div className="p-4 pt-5 items-start w-full space-y-3">
        {/* Categoria */}
        <Skeleton className="h-3 w-1/4 rounded-sm" />
        {/* Título */}
        <div className="space-y-2 mt-2">
          <Skeleton className="h-[22px] w-[90%] rounded-sm" />
          <Skeleton className="h-[22px] w-[60%] rounded-sm" />
        </div>
        {/* Resumo */}
        <div className="space-y-2 mt-4">
          <Skeleton className="h-3 w-full rounded-sm" />
          <Skeleton className="h-3 w-[85%] rounded-sm" />
        </div>
        
        {/* Meta info */}
        <div className="flex items-center justify-between pt-5 mt-auto border-t border-border w-full">
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-7 rounded-full shrink-0" />
            <Skeleton className="h-3 w-24 rounded-sm" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-4 w-10 rounded-sm" />
            <Skeleton className="h-4 w-10 rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ArticleListItemSkeleton() {
  return (
    <div className="flex gap-4 p-4 bg-transparent border-b border-border">
      {/* Imagem */}
      <Skeleton className="w-[120px] h-[80px] rounded-lg shrink-0" />
      
      {/* Conteúdo */}
      <div className="flex flex-col justify-center flex-1 space-y-2">
        <Skeleton className="h-[20px] w-3/4 rounded-sm" />
        <Skeleton className="h-3 w-1/2 rounded-sm" />
        
        {/* Meta */}
        <div className="flex items-center gap-4 pt-2">
          <Skeleton className="h-3 w-24 rounded-sm" />
        </div>
      </div>
    </div>
  );
}

export function DashboardCardSkeleton() {
  return (
    <div className="bg-paper-alt border border-border rounded-xl p-6">
      <div className="flex items-start justify-between mb-3">
        <Skeleton className="h-4 w-1/2 rounded-sm" />
        <Skeleton className="w-6 h-6 rounded-sm" />
      </div>
      <Skeleton className="h-8 w-3/4 rounded-sm" />
    </div>
  );
}