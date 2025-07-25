# Projeto URL Shortener API - NestJS + Prisma + PostgreSQL + Docker

<p align="center">
  <a href="https://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo" />
  </a>
</p>

## Descrição

API RESTful para encurtamento de URLs construída com NestJS, Prisma ORM e PostgreSQL.  
Suporta cadastro e autenticação de usuários, encurtamento de URLs (com ou sem autenticação), contagem de cliques, atualização e exclusão lógica.

---

## Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (v18 ou superior recomendado)
- [npm](https://www.npmjs.com/) (vem com Node.js)

---

## Passo a passo para rodar o projeto

### 1. Clone o repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd <PASTA_DO_PROJETO>
```

### 2. Configure variáveis de ambiente

### Crie um arquivo .env na raiz do projeto (baseado no .env.example)

### 3. Levantar o banco de dados com Docker Compose

```bash
docker-compose up -d
```

### 4. Instale as dependências do Node.js

```bash
npm install
```

### 5. Inicialize o Prisma

Gere o Prisma Client:

```bash
npx prisma generate
```

Rode as migrations para criar as tabelas no banco:

```bash
npx prisma migrate dev --name init
```

### 6. Rode a aplicação NestJS

```bash
npm run start:dev
```
