//Aqui eu importo a biblioteca principal do React para utilizar a sintaxe jsx e o ecossistema de componentes.
import React from 'react';

//Aqui eu importo a API do ReactDOM Client, que é responsável por renderizar a árvore de componentes do React diretamente no DOM do navegador.
import ReactDOM from 'react-dom/client';

//aqui eu importo o componente raiz 'App' que funcionará como a estrutura principal que agrupa nossos componentes (Header, Cards e Modeias).
import App from './App.jsx';

//Aqui eu importo nosso arquivo SCSS principal global, que inicializara as variáveis, mixins e o grid do BootStrap para toda a aplicação.
import './styles/main.scss';

//Aqui eu seleciono o elemento HTML com id "root" e inicializo a renderização da aplicação React.
ReactDOM.createRoot(document.getElementById('root')).render(
  
  //O StrictMode ativa verificaçoes adicionais durante o desenvolvimento para detectar efeitos colaterais e trechos de códigos obsoletos.
  <React.StrictMode>
    <App/>
  </React.StrictMode>
)