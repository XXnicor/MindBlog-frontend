import { useState, useEffect, FormEvent, ChangeEvent, KeyboardEvent } from 'react';
import { ArrowLeft, Upload, X, Plus } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { articleService } from '../lib/api';
import { Article } from '../types/article';

export default function ArticleForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState('Dev');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const SUMMARY_MAX = 200;
  const CONTENT_MAX = 8000;
  const WORDS_PER_MINUTE = 200;

  useEffect(() => {
    let cancelled = false;

    async function loadArticleData(articleId: string) {
      if (!cancelled) setIsLoading(true);
      try {
        const article = await articleService.getById(articleId);
        
        if (!cancelled) {
          setTitle(article.titulo || '');
          setSummary(article.resumo || '');
          setCategory(article.categoria || 'Dev');
          setContent(article.conteudo || '');
          setTags(article.tags || []);
          setExistingImageUrl(article.imagem_banner_url || article.imagem || '');
        }
      } catch (error) {
        console.error('Erro ao carregar artigo:', error);
        if (!cancelled) alert('Erro ao carregar artigo para edição.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    if (isEditMode && id) {
      loadArticleData(id);
    }

    return () => { cancelled = true; };
  }, [isEditMode, id]);

  const calculateReadingTime = (text: string): number => {
    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
  };

  const countWords = (text: string): number => {
    return text.trim().split(/\s+/).filter(w => w.length > 0).length;
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (title.length < 5 || title.length > 200) {
        throw new Error('O título deve ter entre 5 e 200 caracteres');
      }

      if (content.length < 100) {
        throw new Error('O conteúdo deve ter pelo menos 100 caracteres');
      }

      if (summary.length > 200) {
        throw new Error('O resumo deve ter no máximo 200 caracteres');
      }

      const formData = new FormData();
      formData.append('titulo', title);
      formData.append('conteudo', content);
      formData.append('categoria', category);
      
      if (summary) {
        formData.append('resumo', summary);
      }
      
      if (tags.length > 0) {
        formData.append('tags', JSON.stringify(tags));
      }
      
      if (image) {
        formData.append('imagem', image);
      }

      let result;
      if (isEditMode && id) {
        result = await articleService.update(id, formData);
      } else {
        result = await articleService.create(formData);
      }
      
      alert(`Artigo ${isEditMode ? 'editado' : 'criado'} com sucesso!`);
      
      if (!isEditMode && result && result.id) {
        const articleId = result.id;
        navigate(`/artigo/${articleId}`);
      } else {
        navigate('/dashboard');
      }
      
    } catch (error: any) {
      const errorMessage = error.message || `Erro ao ${isEditMode ? 'editar' : 'criar'} artigo. Tente novamente.`;
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const readingTime = calculateReadingTime(content);
  const wordCount = countWords(content);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-400">Carregando artigo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Dashboard</span>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {isEditMode ? 'Editar Artigo' : 'Criar Novo Artigo'}
          </h1>
          <p className="text-slate-400">
            {isEditMode 
              ? 'Atualize as informações do seu artigo' 
              : 'Compartilhe seu conhecimento com a comunidade'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-white font-medium mb-2">
              Título do Artigo
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título do seu artigo..."
              required
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Resumo */}
          <div>
            <label htmlFor="summary" className="block text-white font-medium mb-2">
              Resumo
            </label>
            <textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value.slice(0, SUMMARY_MAX))}
              placeholder="Escreva um breve resumo do artigo..."
              required
              rows={3}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
            />
            <div className="mt-1 text-right text-sm text-slate-400">
              {summary.length}/{SUMMARY_MAX}
            </div>
          </div>

          {/* Categoria */}
          <div>
            <label htmlFor="category" className="block text-white font-medium mb-2">
              Categoria
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
            >
              <option value="Dev">Desenvolvimento</option>
              <option value="DevOps">DevOps</option>
              <option value="IA">Inteligência Artificial</option>
            </select>
          </div>

          {/* Upload de Imagem */}
          <div>
            <label htmlFor="image" className="block text-white font-medium mb-2">
              Imagem de Capa
            </label>
            <div className="relative">
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="image"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-400 hover:text-white hover:border-cyan-500 cursor-pointer transition-colors"
              >
                <Upload className="w-5 h-5" />
                <span>
                  {image 
                    ? image.name 
                    : existingImageUrl 
                      ? 'Imagem existente (clique para alterar)' 
                      : 'Clique para fazer upload da imagem'
                  }
                </span>
              </label>
            </div>
            
            {image && (
              <div className="mt-3">
                <img 
                  src={URL.createObjectURL(image)} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-lg border border-slate-700"
                />
                <p className="mt-1 text-xs text-slate-400">Preview: {image.name}</p>
              </div>
            )}
            
            {existingImageUrl && !image && (
              <div className="mt-3">
                <img 
                  src={existingImageUrl} 
                  alt="Imagem atual" 
                  className="w-full h-48 object-cover rounded-lg border border-slate-700"
                />
                <p className="mt-1 text-xs text-slate-400">Imagem atual</p>
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tagInput" className="block text-white font-medium mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-3">
              <input
                id="tagInput"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Digite uma tag e pressione Enter..."
                className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white hover:bg-slate-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Adicionar
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-sm text-slate-300"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Conteúdo do Artigo */}
          <div>
            <label htmlFor="content" className="block text-white font-medium mb-2">
              Conteúdo do Artigo
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, CONTENT_MAX))}
              placeholder="Escreva o conteúdo completo do seu artigo... Você pode usar Markdown."
              required
              rows={16}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none font-mono text-sm"
            />
            <div className="mt-2 text-sm text-slate-400">
              <span>
                {content.length}/{CONTENT_MAX} caracteres • {wordCount} palavras • {readingTime} {readingTime === 1 ? 'minuto' : 'minutos'} de leitura
              </span>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-slate-900 font-semibold rounded-lg transition-colors"
            >
              {isSubmitting 
                ? (isEditMode ? 'Salvando...' : 'Publicando...') 
                : (isEditMode ? 'Salvar Alterações' : 'Publicar Artigo')
              }
            </button>
            <Link
              to="/dashboard"
              className="px-6 py-3 bg-transparent border border-slate-700 hover:border-slate-500 text-white rounded-lg transition-colors text-center"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}