import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AllArticles from './pages/AllArticles';
import ArticlePage from './pages/ArticlePage';
import ArticleForm from './pages/ArticleForm';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProfileSettings from './pages/ProfileSettings';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/artigos" element={<AllArticles />} />
      <Route path="/artigo/:id" element={<ArticlePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
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
    </Routes>
  );
}
