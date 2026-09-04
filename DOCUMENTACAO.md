# 🚀 Dev Hub | Documentação Arquitetural Full-Stack

Esta documentação mestre detalha a arquitetura, fluxo de dados, modelo de banco de dados e o plano de execução para a construção da plataforma **Dev Hub**.

---

## 🏗️ 1. Visão Geral da Arquitetura

O sistema adota o padrão de **Decoupled Architecture** (Arquitetura Desacoplada) em modelo Monorepo, separando totalmente a interface de usuário da lógica de negócios e persistência.

```text
[ Cliente / Browser ]
        │
        ▼
┌──────────────────┐       HTTPS / JSON       ┌──────────────────┐
│  React.js (Vite) │ ◄──────────────────────► │ Python (FastAPI) │
└──────────────────┘                          └────────┬─────────┘
   (Front-end)                                         │
                                       ┌───────────────┴───────────────┐
                                       ▼                               ▼
                            ┌──────────────────┐            ┌──────────────────┐
                            │ Cloud Storage    │            │  MySQL Database  │
                            │ (Imagens)        │            │  (Dados & Auth)  │
                            └──────────────────┘            └──────────────────┘


📂 Estrutura do Repositório (Monorepo)

AGREGADOR-DE-LINKS/
├── DOCUMENTACAO.md       <-- Documentação mestre de arquitetura
├── REQUISITOS.md         <-- Mapeamento de RF, RNF e Regras de Negócio
├── README.md             <-- Apresentação do projeto para o GitHub
├── .gitignore            <-- Proteção global contra commit de segredos
│
├── frontend/             <-- Interface de Usuário (React + SCSS)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── backend/              <-- API RESTful (Python + FastAPI)
    ├── venv/
    ├── app/
    │   ├── main.py
    │   ├── database.py
    │   ├── models.py
    │   └── schemas.py
    ├── .env
    └── requirements.txt

🗄️ 2. Modelagem Relacional do Banco de Dados (DER)A estrutura de persistência no MySQL foi desenhada em 3 entidades principais para garantir a integridade dos dados e evitar duplicidade.┌─────────────────────────┐       ┌─────────────────────────┐
│        usuarios         │       │        projetos         │
├─────────────────────────┤       ├─────────────────────────┤
│ PK  id (INT)            │       │ PK  id (INT)            │
│     nome (VARCHAR)      │       │     titulo (VARCHAR)    │
│     email (VARCHAR, UQ) │       │     subtitulo (VARCHAR) │
│     senha_hash (VARCHAR)│       │     descricao (TEXT)    │
└─────────────────────────┘       │     categoria (VARCHAR) │
                                  │     imagem_url (VARCHAR)│
                                  │     demo_url (VARCHAR)  │
                                  │     github_url (VARCHAR)│
                                  └────────────┬────────────┘
                                               │ 1
                                               │
                                               │ N
                                  ┌────────────┴────────────┐
                                  │       tecnologias       │
                                  ├─────────────────────────┤
                                  │ PK  id (INT)            │
                                  │ FK  projeto_id (INT)    │
                                  │     nome (VARCHAR)      │
                                  └─────────────────────────┘


## 🌐 3. Matriz de Endpoints da API (RESTful)

| **Método** | **Endpoint** | **Descrição** | **Nível de Acesso** |
|:---:|---|---|---|
| `GET` | `/api/projetos` | Lista todos os projetos cadastrados para exibição pública | **Público** |
| `GET` | `/api/projetos/{id}` | Retorna os detalhes de um único projeto | **Público** |
| `POST` | `/api/auth/login` | Autentica o administrador e gera o Token JWT | **Público** |
| `POST` | `/api/projetos` | Cadastra um novo projeto no banco de dados | **Privado (Token JWT)** |
| `PUT` | `/api/projetos/{id}` | Atualiza os dados de um projeto existente | **Privado (Token JWT)** |
| `DELETE` | `/api/projetos/{id}` | Remove um projeto e suas dependências | **Privado (Token JWT)** |
| `POST` | `/api/upload` | Envia imagem para o Cloud Storage e retorna a URL | **Privado (Token JWT)** |

🗺️ 4. Cronograma Mestre de Desenvolvimento
Fase 1: Conclusão do Front-end (Concluído)

[x] Refatoração para estrutura modular em frontend/.

[x] Implementação de UI orientada a dados (labels dinâmicos no Modal).

[x] Configuração global de segurança no .gitignore.

Fase 2: Banco de Dados & Scripting (Em Andamento)

[x] Criação do banco de dados no MySQL Workbench.

[x] Execução das tabelas (usuarios, projetos, tecnologias).

[x] Criação do script de Seed Data (seed.sql) para carga inicial de testes.


Fase 3: Construção da API (FastAPI)

[x] Configuração do venv e instalação de dependências no Python.

[x] Conexão do SQLAlchemy com o MySQL local.

[x] Mapeamento das rotas públicas GET.

[x] Mapeamento da rota de criação POST (`/api/projetos`)

[x] Teste e validação de endpoints via Swagger UI (`/docs`).

Fase 4: Segurança & Autenticação

[ ] Hash de senhas com bcrypt.

[ ] Geração e validação de tokens JWT.

[ ] Bloqueio das rotas de mutação (POST, PUT, DELETE).

Fase 5: Mídia & Cloud Storage

[ ] Integração com serviço de nuvem (Cloudinary / Supabase).

[ ] Testes de requisição multipart no Postman/Insomnia.

Fase 6: Integração Full-Stack & Deploy

[ ] Troca de dados estáticos do React por chamadas fetch à API.

[ ] Habilitação de CORS no FastAPI.

[ ] Publicação do Front-end (Vercel) e Back-end (Render).

🚀 5. Guia de Execução LocalExecutando o Front-endBashcd frontend
npm install
npm run dev

Executando o Back-endBashcd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload