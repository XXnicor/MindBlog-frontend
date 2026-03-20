/**
 * Utilitários para trabalhar com imagens do backend
 */

// Usar a mesma base URL da API, mas sem o /api
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const UPLOADS_BASE_URL = `${API_BASE}/uploads`;

/**
 * Converte o nome/caminho do arquivo para URL completa
 */
export const getImageUrl = (imagePath: string | null | undefined): string | null => {
  if (!imagePath) return null;
  
  // Se já é uma URL completa, retornar direto
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Se começa com 'uploads/', remover essa parte
  const cleanPath = imagePath.startsWith('uploads/') 
    ? imagePath.substring(8) 
    : imagePath;
  
  const fullUrl = `${UPLOADS_BASE_URL}/${cleanPath}`;
  return fullUrl;
};

/**
 * Retorna URL de avatar ou fallback
 */
export const getAvatarUrl = (avatar: string | null | undefined, userName: string): string => {
  if (avatar) {
    const avatarUrl = getImageUrl(avatar);
    if (avatarUrl) return avatarUrl;
  }
  
  // Fallback para avatar gerado
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&size=200&background=06b6d4&color=fff`;
};

/**
 * Placeholder para imagens de artigos
 */
export const ARTICLE_IMAGE_PLACEHOLDER = 'https://placehold.co/1200x600/1e293b/cyan?text=Artigo';
