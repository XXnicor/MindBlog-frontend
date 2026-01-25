# Blog Frontend — Tailwind setup

Arquivos adicionados para facilitar a configuração do Tailwind e build local.

Passos recomendados (PowerShell):

1. Inicialize o `package.json` (se você não quiser usar o meu):

```powershell
npm init -y
```

2. Instale dependências (já listadas em `package.json`):

```powershell
npm install
```

3. Gerar o CSS do Tailwind (modo desenvolvimento — watch):

```powershell
npm run dev:css
```

ou gerar CSS final minificado:

```powershell
npm run build:css
```

Observações sobre o erro `npx tailwindcss init -p`:
- Esse erro geralmente ocorre quando o `npx` não consegue resolver qual executável rodar (cache corrompido, npm desatualizado, ou ausência de `package.json`).
- Se o `npx` continuar falhando, rode:

```powershell
npm cache clean --force
npm install -g npm@latest
npx --ignore-existing tailwindcss@latest init -p
```

Se preferir, já criei `tailwind.config.cjs` e `postcss.config.cjs` neste repositório — você pode pular `npx tailwindcss init -p` e apenas rodar `npm install`.
