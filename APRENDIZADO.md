# 📓 Diário de Aprendizado & Evolução Técnica | Dev Hub

Este documento é o registro de fixação técnica dos conceitos, arquiteturas e regras de negócio aplicados durante a construção da aplicação **Dev Hub Full-Stack**.

---

## 🏗️ 1. Arquitetura e Estruturação de Projetos

- [x] **Monorepo e Separação de Responsabilidades**
  * **Conceito:** Organização do projeto isolando o `frontend/` (React) e `backend/` (FastAPI) em um único repositório, mantendo configurações globais (`.gitignore`, documentações) na raiz.
  * **OBS:** *[Escreva aqui com suas palavras o que você entendeu sobre manter front e back separados]*

- [x] **Ambiente Virtual Python (`venv`)**
  * **Conceito:** Criar uma "caixa" isolada de bibliotecas Python para impedir conflitos globais de versão no sistema operacional e facilitar o deploy.
  * **OBS:** *[Escreva aqui com suas palavras a importância do venv e a comparação com o node_modules]*

- [x] **Segurança de Arquivos e `.gitignore`**
  * **Conceito:** Proteger credenciais (`.env`), pastas pesadas de dependências e arquivos temporários de cache antes de subir para o GitHub.
  * **OBS:** *[Escreva aqui por que não devemos subir a node_modules nem o .env]*

---

## 🗄️ 2. Banco de Dados e Modelagem SQL (MySQL)

- [x] **Criação de Banco Isolado (`CREATE DATABASE`)**
  * **Conceito:** Separar a base do Dev Hub de outros projetos para garantir autonomia dos dados.
  * **OBS:** *[Escreva aqui por que usamos o banco dev_hub]*

- [x] **Tipos de Dados e Restrições (`VARCHAR`, `TEXT`, `UNIQUE`, `NOT NULL`)**
  * **Conceito:** Definir o tamanho e as regras de cada coluna para evitar dados corrompidos e otimizar espaço de armazenamento.
  * **OBS:** *[Escreva aqui o que você aprendeu sobre a diferença de VARCHAR e TEXT, e para que serve o UNIQUE]*

- [x] **Relacionamento entre Tabelas (`FOREIGN KEY` e `ON DELETE CASCADE`)**
  * **Conceito:** Conectar a tabela `tecnologias` à tabela `projetos` e garantir a exclusão automática de dependências quando um projeto for apagado.
  * **OBS:** *[Escreva aqui o que o ON DELETE CASCADE faz na prática]*

- [x] **Script de Carga Inicial (`Seed Data`)**
  * **Conceito:** Inserir dados padrão de teste no banco para validar se a comunicação com a API e com o Front-end funcionará.
  * **OBS:** *[Pendente]*

---

## 🛡️ 3. Regras de Negócio e Segurança da Aplicação

- [ ] **RN-01 (Acesso Restrito ao Admin)**
  * **Conceito:** Bloquear alterações no MySQL exigindo a validação de um Token JWT enviado via requisição.
  * **OBS:** *[Pendente]*

- [ ] **RN-02 (Persistência de Mídia no Cloud Storage)**
  * **Conceito:** Roteamento de imagens binárias para serviços na nuvem (ex: Cloudinary), gravando no banco MySQL apenas a URL em texto.
  * **OBS:** *[Escreva aqui por que não salvamos imagens dentro da pasta do servidor Python]*

- [ ] **RN-03 (Sessão Expirável)**
  * **Conceito:** Definir tempo limite de validade para o Token JWT, forçando novo login por razões de segurança.
  * **OBS:** *[Pendente]*

- [ ] **Criptografia de Senhas (`bcrypt`)**
  * **Conceito:** Transformar senhas brutas em hashes indecifráveis para proteger acessos no banco.
  * **OBS:** *[Pendente]*

---

## ⚡ 4. Back-end, API e Comunicação Full-Stack

- [ ] **Rotas RESTful no FastAPI (GET, POST, PUT, DELETE)**
  * **Conceito:** Mapear operações de leitura e escrita via protocolo HTTP.
  * **OBS:** *[Pendente]*

- [ ] **Proteção e Autorização de Origem (CORS)**
  * **Conceito:** Liberar o navegador para aceitar requisições do servidor do React apontando para a API do Python.
  * **OBS:** *[Pendente]*

- [ ] **Melhoria de UX com Skeleton Loaders e Toasts**
  * **Conceito:** Dar feedback visual de carregamento e avisos de erro/sucesso para o usuário final.
  * **OBS:** *[Pendente]*