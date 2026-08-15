# 🚀 Dev Hub | Portfólio & Agregador de Links

Um portfólio interativo e agregador de links moderno, projetado com foco absoluto em UI/UX. Utilizando efeitos avançados de Glassmorphism e Neon, o projeto serve como um cartão de visitas digital dinâmico para apresentar projetos reais, autorais e protótipos de forma elegante.

## 🛠️ Tecnologias Utilizadas

### Front-end (Atual)
* **React.js** (Ambiente gerado via Vite para build ultrarrápido)
* **SCSS / CSS Modules** (Estilização modularizada, variáveis e mixins)
* **React Icons** (Renderização direta em SVG para alta performance)

### Back-end (Implementação Futura 🚧)
O projeto está estruturado para receber uma API RESTful que tornará o conteúdo dinâmico.
* **Python** (Frameworks como FastAPI, Flask ou Django) responsáveis por fornecer os dados via API.
* **Banco de Dados** (ex: PostgreSQL ou SQLite) para armazenar as categorias, informações do perfil e a lista de projetos.
* **Objetivo da Integração:** Permitir que o Front-end consuma os dados da API, eliminando a necessidade de alterar o código-fonte front-end sempre que um novo projeto ou link for adicionado ao portfólio.

## ✨ Funcionalidades

* **Design Imersivo:** Tema Dark com elementos de vidro fosco (Glassmorphism) e iluminação condicional em Neon.
* **Navegação Dinâmica:** Cards interativos que acionam Modais (Bottom Sheets) com informações detalhadas e links externos.
* **Responsividade:** Layout construído com abordagem mobile-first, adaptando-se perfeitamente a qualquer tela.
* **Pronto para Escalar:** Estrutura de dados mockada via arquivos separados, preparada para a futura transição para requisições HTTP (Back-end em Python).
