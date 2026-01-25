import React from 'react'
import { Link } from 'react-router-dom'
import { Clock, Eye } from 'lucide-react'

export type Article = {
  id: string
  title: string
  summary: string
  category: string
  author: string
  readTime: string
  views: number
  image?: string
  highlight?: boolean
  date?: string
}

export default function ArticleCard({ article }: { article: Article }){
  return (
    <Link to={`/artigo/${article.id}`}>
      <article className={`bg-slate-900 border ${article.highlight ? 'border-cyan-500' : 'border-slate-800'} rounded-md overflow-hidden hover:border-slate-700 transition-colors cursor-pointer`}> 
        <div className="h-40 bg-gradient-to-br from-pink-300 to-sky-200 flex items-center justify-center text-slate-900 font-extrabold text-3xl">
          {/* placeholder image */}
          {article.image ? <img src={article.image} alt={article.title} className="w-full h-full object-cover"/> : <div className="p-6">Lorem<br/>ipsum</div>}
        </div>

        <div className="p-4">
          <span className="inline-block bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded">{article.category}</span>
          <h3 className="text-white font-semibold mt-3">{article.title}</h3>
          <p className="text-slate-400 mt-2 line-clamp-3 text-sm">{article.summary}</p>

          <div className="mt-4 flex items-center justify-between text-slate-400 text-sm">
            <div>{article.author}</div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1"><Clock size={14} /> <span>{article.readTime}</span></div>
              <div className="flex items-center gap-1"><Eye size={14} /> <span>{article.views}</span></div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}