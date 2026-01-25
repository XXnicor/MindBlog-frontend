import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AllArticles from './pages/AllArticles';
import ArticlePage from './pages/ArticlePage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProfileSettings from './pages/ProfileSettings';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/artigos" element={<AllArticles />} />
      <Route path="/artigo/:id" element={<ArticlePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/settings" element={<ProfileSettings />} />
    </Routes>
  );
}
