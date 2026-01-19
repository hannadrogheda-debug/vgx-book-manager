
# 📚 Book Manager — Desafio Técnico Full Stack

Aplicação full-stack para gerenciamento de livros, com autenticação JWT e CRUD completo.

O projeto foi desenvolvido **100% online**, utilizando **GitHub Codespaces** no frontend e backend, e **PostgreSQL no Railway**.

---

## Stack utilizada

### Backend
- NestJS
- TypeScript
- TypeORM
- JWT (autenticação)
- PostgreSQL (Railway)

### Frontend
- Next.js (App Router)
- TypeScript
- TailwindCSS

---

## 🔐 Funcionalidades

### Autenticação
- Criar conta (`/auth/register`)
- Login (`/auth/login`)
- Rotas protegidas por JWT

### Livros
- Listar livros
- Buscar por título, autor ou descrição
- Criar livro
- Editar livro
- Excluir livro
- Buscar livro por ID

---

## 🌐 Aplicação online

### Frontend
👉 https://potential-happiness-q7r7qv695956f6wgq-3000.app.github.dev

### Backend (API)
👉 https://potential-happiness-q7r7qv695956f6wgq-3001.app.github.dev

---

## 📌 Endpoints principais (Backend)

### Auth
- `POST /auth/register` — criar usuário
- `POST /auth/login` — autenticação (retorna JWT)

### Books (JWT obrigatório)
- `GET /books`
- `GET /books?search=termo`
- `GET /books/:id`
- `POST /books`
- `PATCH /books/:id`
- `DELETE /books/:id`

---

## 🗄️ Banco de dados

- PostgreSQL hospedado no **Railway**
- Estrutura versionada via arquivo `schema.sql` no backend

---

## ▶️ Rodando localmente (opcional)

### Backend
```bash
cd backend
npm install
npm run start:dev

## AUTOR

- Hanna de Quadros Freitas