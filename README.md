# TechBlog - Frontend

Interface moderna e responsiva para plataforma de blog técnico, desenvolvida com React, Vite e Tailwind CSS. Oferece uma experiência de usuário fluida com autenticação completa, dashboard administrativo e editor de artigos com suporte a Markdown e upload de imagens.

---

## � Demonstração do Sistema

<div align="center">

### 🚀 Tour pelo Blog
<img src="docs/gifs/tour pelo blog.mp4" alt="Tour pelo Blog" width="800px">

*Navegação completa pela interface, listagem de artigos e exploração das funcionalidades principais*

---

### 🔐 Login
<img src="docs/gifs/login.mp4" alt="Login" width="800px">

*Autenticação de usuários com validação de credenciais e feedback visual*

---

### 📋 Cadastro de Usuário
<img src="docs/gifs/cadastro.mp4" alt="Cadastro" width="800px">

*Criação de nova conta com validação de formulário e confirmação de registro*

---

### ✍️ Criação de Artigo com Upload de Imagem
<img src="docs/gifs/criação e salvamento de img.mp4" alt="Criar Artigo" width="800px">

*Editor completo com upload de banner, formatação de conteúdo e publicação de artigos*

---

### ✏️ Atualizar Artigo
<img src="docs/gifs/atualizar artigo.mp4" alt="Editar Artigo" width="800px">

*Edição de artigos existentes com atualização de conteúdo e imagens*

---

### 🗑️ Excluir Artigo
<img src="docs/gifs/exluir artigo.mp4" alt="Deletar Artigo" width="800px">

*Remoção de artigos com confirmação e feedback de sucesso*

---

</div>

## 🚀 Tecnologias

Este projeto foi desenvolvido com as seguintes tecnologias:

- **React 18.2** - Biblioteca JavaScript para construção de interfaces
- **TypeScript 5.9** - Superset tipado do JavaScript
- **Vite 7.3** - Build tool moderna e rápida
- **Tailwind CSS 3.4** - Framework CSS utility-first
- **React Router DOM 7.13** - Roteamento para aplicações React
- **Lucide React** - Biblioteca de ícones moderna e leve
- **Axios** - Cliente HTTP para comunicação com API

## ✨ Funcionalidades

### Autenticação
- **Login e Cadastro** - Sistema completo de autenticação com JWT
- **Proteção de Rotas** - Rotas privadas acessíveis apenas para usuários autenticados
- **Gerenciamento de Sessão** - Persistência de login com localStorage

### Dashboard Administrativo
- **Painel de Controle** - Visão geral com estatísticas de artigos, visualizações, curtidas e comentários
- **Gerenciamento de Artigos** - Lista completa dos artigos do usuário com opções de editar e excluir
- **Atividades Recentes** - Acompanhamento de interações dos leitores

### Editor de Artigos
- **Criação e Edição** - Interface intuitiva para escrever e editar artigos
- **Upload de Imagens** - Suporte para imagens de banner com preview em tempo real
- **Sistema de Tags** - Organização de conteúdo com tags personalizadas
- **Categorias** - Classificação de artigos (Dev, DevOps, IA)
- **Markdown Support** - Suporte completo para formatação em Markdown
- **Contador de Palavras** - Cálculo automático de tempo de leitura

### Interface
- **Dark Mode Nativo** - Visual escuro moderno e elegante
- **Design Responsivo** - Interface adaptável para desktop, tablet e mobile
- **Componentes Reutilizáveis** - Arquitetura modular e escalável
- **Animações Suaves** - Transições e efeitos visuais otimizados

### Listagem de Artigos
- **Paginação** - Navegação eficiente por grandes volumes de conteúdo
- **Busca e Filtros** - Pesquisa por título e filtro por categoria
- **Modos de Visualização** - Grade ou lista para melhor experiência
- **Sistema de Comentários** - Interação entre autores e leitores

## 📦 Instalação

Clone o repositório e instale as dependências:

```bash
# Clone o repositório
git clone <url-do-repositorio>

# Entre na pasta do projeto
cd blog-frontend

# Instale as dependências
npm install
```

## ⚙️ Configuração da API

O frontend está configurado para se comunicar com o backend na porta **3001**. Certifique-se de que o backend esteja rodando antes de iniciar o frontend.

**Configuração padrão:**
- Backend API: `http://localhost:3001/api`
- Frontend: `http://localhost:5173`

Se necessário, você pode alterar a URL da API editando o arquivo `src/lib/api.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
```

Ou criar um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3001/api
```

## 🎯 Como Rodar

Após instalar as dependências e garantir que o backend está rodando:

```bash
# Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em: **http://localhost:5173**

### Outros Comandos

```bash
# Build para produção
npm run build

# Preview do build de produção
npm run preview

# Build do CSS (Tailwind)
npm run build:css

# Watch mode do CSS
npm run dev:css
```

## 🔐 Credenciais de Teste

Para testar a aplicação, você pode:

### Opção 1: Criar um novo usuário
1. Acesse a página de cadastro
2. Preencha os dados (nome, email, senha)
3. Faça login com as credenciais criadas

### Opção 2: Usar credenciais padrão (se o backend já vem populado)
```
Email: admin@email.com
Senha: 123456
```

## 📂 Estrutura do Projeto

```
blog-frontend/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── ArticleCard.tsx
│   │   ├── CommentSection.tsx
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── UserMenu.tsx
│   ├── contexts/            # Context API
│   │   └── AuthContext.tsx
│   ├── lib/                 # Utilitários e configurações
│   │   ├── api.ts          # Configuração da API
│   │   └── imageUtils.ts   # Helpers de imagem
│   ├── pages/              # Páginas da aplicação
│   │   ├── AllArticles.tsx
│   │   ├── ArticleForm.tsx
│   │   ├── ArticlePage.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── ProfileSettings.tsx
│   │   └── Register.tsx
│   ├── App.tsx             # Componente principal
│   ├── main.tsx            # Ponto de entrada
│   └── index.css           # Estilos globais
├── public/                 # Arquivos estáticos
├── package.json
├── tailwind.config.cjs     # Configuração do Tailwind
├── tsconfig.json           # Configuração do TypeScript
└── vite.config.ts          # Configuração do Vite
```

## 🎨 Recursos de Interface

- **Paleta de Cores:** Tons de slate com acentos em cyan
- **Tipografia:** Fontes otimizadas para legibilidade
- **Ícones:** Lucide React com mais de 1000 ícones
- **Responsividade:** Breakpoints mobile-first
- **Acessibilidade:** ARIA labels e navegação por teclado

## 📝 Funcionalidades Principais por Página

### Home (`/`)
- Hero section com destaque para artigos principais
- Grid de artigos recentes
- Categorias populares
- Call-to-action para cadastro

### Artigos (`/artigos`)
- Listagem completa com paginação
- Busca em tempo real
- Filtros por categoria
- Alternar entre visualização em grade e lista

### Dashboard (`/dashboard`)
- Cards de estatísticas
- Lista de artigos do usuário
- Ações rápidas (editar/deletar)
- Atividades recentes

### Criar/Editar Artigo (`/artigos/novo` | `/artigos/editar/:id`)
- Editor rico com preview
- Upload de imagem de banner
- Validações em tempo real
- Auto-save de rascunho

### Configurações (`/settings`)
- Edição de perfil
- Upload de avatar
- Alteração de senha
- Estatísticas do usuário

## 🔗 Integração com Backend

O frontend consome as seguintes APIs:

- `POST /api/auth/register` - Cadastro de usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Dados do usuário logado
- `GET /api/articles` - Listagem de artigos
- `GET /api/articles/:id` - Detalhes de um artigo
- `POST /api/articles` - Criar artigo
- `PUT /api/articles/:id` - Editar artigo
- `DELETE /api/articles/:id` - Deletar artigo
- `GET /api/users/my-articles` - Artigos do usuário
- `GET /api/users/stats` - Estatísticas do usuário
- `PUT /api/users/profile` - Atualizar perfil

## 🐛 Troubleshooting

### Erro de CORS
Certifique-se de que o backend está configurado para aceitar requisições do frontend:
```javascript
// No backend
app.use(cors({
  origin: 'http://localhost:5173'
}));
```

### Imagens não carregam
Verifique se o backend está servindo os arquivos da pasta `uploads/` corretamente.

### Token expirado
Faça logout e login novamente para renovar o token JWT.

## 📄 Licença

Este projeto é open source e está disponível sob a licença MIT.

---

**Desenvolvido com ❤️ usando React + Vite + Tailwind CSS**
