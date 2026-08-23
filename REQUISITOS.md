# 📑 Engenharia de Requisitos | Dev Hub Full-Stack

Este documento especifica os Requisitos Funcionais, Não-Funcionais e as Regras de Negócio que regem o desenvolvimento da aplicação.

---

## 🎯 1. Requisitos Funcionais (RF)

| Código | Requisito | Descrição |
| :--- | :--- | :--- |
| **RF-01** | Visualização de Portfólio | O sistema deve exibir o perfil do desenvolvedor, links sociais e cards de projetos categorizados na página pública (`/`). |
| **RF-02** | Detalhamento em Modal | Ao clicar em um card, o sistema deve abrir um Modal (Bottom Sheet) contendo descrição, tags e botões dinâmicos. |
| **RF-03** | Rota Administrativa | O sistema deve dispor da rota `/admin` para acesso ao painel de gerenciamento do sistema. |
| **RF-04** | Autenticação de Usuário | O sistema deve autenticar o administrador via e-mail e senha, retornando um Token JWT. |
| **RF-05** | Gerenciamento de Conteúdo (CRUD) | O administrador autenticado deve poder Criar, Ler, Atualizar e Deletar projetos e links no sistema. |
| **RF-06** | Upload de Mídia na Nuvem | O painel Admin deve permitir envio de imagens, disparando o upload direto para um serviço de Cloud Storage. |
| **RF-07** | Notificações do Sistema | O painel Admin deve exibir alertas visuais (*Toasts*) confirmando o sucesso ou falha de cada operação. |

---

## ⚡ 2. Requisitos Não-Funcionais (RNF)

| Código | Requisito | Descrição |
| :--- | :--- | :--- |
| **RNF-01** | Design & Interface | Estilização utilizando o conceito Dark Theme com iluminação Neon e elementos em Glassmorphism via SCSS Modules. |
| **RNF-02** | Responsividade | Layout mobile-first adaptável a telas de smartphones (320px+), tablets e desktops. |
| **RNF-03** | Performance & UX | Utilização de Skeleton Loaders para feedback imediato na tela enquanto a API carrega os dados. |
| **RNF-04** | Segurança de Credenciais | As senhas salvas no banco de dados devem ser encriptadas via algoritmo `bcrypt`. |
| **RNF-05** | Proteção da API | A API Python deve aplicar proteção CORS e sanitização de dados com Pydantic para mitigar SQL Injection. |
| **RNF-06** | SEO e Open Graph | O sistema deve conter meta tags dinâmicas para gerar previews estruturados ao compartilhar o link em redes sociais. |

---

## 🛡️ 3. Regras de Negócio (RN)

* **RN-01 (Acesso Restrito):** Apenas requisições HTTP que apresentem um Token JWT válido nos headers poderão alterar ou excluir registros no MySQL.
* **RN-02 (Persistência de Mídia):** Nenhuma imagem deve ser salva no sistema de arquivos local do FastAPI. O arquivo binário vai para o Cloud Storage e apenas a string da URL é gravada no MySQL.
* **RN-03 (Sessão Expirável):** O Token JWT deve possuir tempo de expiração definido, forçando a reautenticação em caso de chave vencida.