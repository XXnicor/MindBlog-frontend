import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AllArticles from './pages/AllArticles';
import ArticlePage from './pages/ArticlePage';
import ArticleForm from './pages/ArticleForm';
import AuthPage from './pages/auth/AuthPage';
import Dashboard from './pages/Dashboard';
import ProfileSettings from './pages/ProfileSettings';
import NotFound from './pages/NotFound';
import ServerError from './pages/ServerError';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <>
      <Toaster position="bottom-right" richColors />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/artigos" element={<AllArticles />} />
        <Route path="/artigo/:id" element={<ArticlePage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        
        {/* Rotas protegidas - requerem autenticação */}
        <Route path="/artigos/novo" element={
          <ProtectedRoute>
            <ArticleForm />
          </ProtectedRoute>
        } />
        <Route path="/artigos/editar/:id" element={
          <ProtectedRoute>
            <ArticleForm />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <ProfileSettings />
          </ProtectedRoute>
        } />
        
        {/* Páginas de erro */}
        <Route path="/404" element={<NotFound />} />
        <Route path="/500" element={<ServerError />} />
        
        {/* Catch-all para 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}