// Aqui eu exporto a lista principal de categorias de projetos.
// Cada objeto desta lista dará origem a um Card Clicável na tela inicial e ao seu respectivo Modal/Bottom Sheet.
import avatar from '../assets/avatar.png'
import card01 from '../assets/card01.png';
import card02 from '../assets/card02.png';
import card03 from '../assets/card03.png';
import b2b_irondome from '../assets/b2b_irondome.png';
import projeto_cardapio from '../assets/projeto_cardapio.png';


export const categoriasProjetos = [
    {
        // Identificador único da categoria.
        id: 'b2b',
        // Texto do selo/badge que será renderizado pelo nosso componente <Badge/>.
        badge: '🌐 EM PRODUÇÃO',
        // Subtítulo descritivo em caixa alta do card.
        subtitulo: 'SOLUÇÕES EMPRESARIAIS',
        // Título principal exibido no card.
        titulo: 'Sistemas Personalizados',
        // Aqui eu defino a imagem de fundo que cobrirá o Card principal na tela inicial.
        imagemFundo: card01,
        // Nome do tema de cor que usarei para aplicar a luz neon correspondente (#00F0FF).
        corTema: 'cyan',
        // Objeto contendo todas as informações que vão preencher o Modal/Bottom Sheet quando o usuário clicar neste card.
        modalInfo: {
            tituloModal: 'Projetos em Produção',
            subtituloModal: 'Sistemas reais desenvolvidos para clientes B2B',
            // Array de projetos reais pertecentes a esta categoria.
            projetos: [
                {
                    id: 'b2b-1',
                    nome: 'Site de uma instituição missionaria iron dome',
                    imagem: b2b_irondome,
                    // Tecnologias utilizadas no projeto para renderizar em formato de pílula/badge.
                    tags: ['React', 'SCSS', 'BootStrap'],
                    linkSite: 'https://www.missoesirondome.com/',
                    linkCodigo: 'https://github.com/joaoprocha35-dev/site-iron-dome-missions.git'
                },
            ]
        }
    },
    {
    id: 'autorais',
    badge: '💡 PROJETOS AUTORAIS',
    subtitulo: 'WEB & MOBILE DESIGN + DEV',
    titulo: 'Aplicações Autorais',
    // Aqui eu defino a imagem de fundo que cobrirá o Card principal na tela inicial.
    imagemFundo: card02,
    // Tema Roxo para indicar inovação/design (#7000FF).
    corTema: 'purple', 
    modalInfo: {
      tituloModal: 'Lab & Projetos Autorais',
      subtituloModal: 'Aplicações criadas para explorar novas tecnologias e UI/UX',
      projetos: [
        {
          id: 'autoral-1',
          nome: 'Fintech Dashboard Dark',
          imagem: projeto_cardapio,
          tags: ['React', 'SCSS', 'BootStrap'],
          linkSite: 'https://katita-lanches.vercel.app/',
          linkCodigo: 'https://github.com/joaoprocha35-dev/katita-delivery-app.git'
        }
      ]
    }
  },
  {
    id: 'prototipos',
    badge: '⚙️ PROTÓTIPOS',
    subtitulo: 'SOLICITE UMA DEMO',
    titulo: 'Conceitos de Inovação',
    // Aqui eu defino a imagem de fundo que cobrirá o Card principal na tela inicial.
    imagemFundo: card03,
    // Tema Dourado/Âmbar para foco em conversão/vendas (#FFB800).
    corTema: 'amber', 
    modalInfo: {
      tituloModal: 'Conceitos & Protótipos',
      subtituloModal: 'Demonstrações técnicas prontas para customização',
      projetos: [
        {
          id: 'proto-1',
          nome: 'Loja Virtual',
          imagem: card03,
          tags: ['HTML', 'CSS', 'JAVASCRIPT'],
          linkSite: 'https://palary-store.vercel.app/',
          // Link com mensagem pré-formatada para abrir direto no seu WhatsApp.
          linkWhatsApp: 'https://wa.me/5514998813787?text=Olá,%20tenho%20interesse%20em%20uma%20demo!'
        }
      ]
    }
  }
];

// Aqui eu exporto as minhas informações pessoais que o componente Header.jsx irá ler.
export const usuarioInfo = {
    nome: 'João Rocha',
    cargo: 'Desenvolvedor WebDesign',
    // Foto de perfil base.
    avatar: avatar, 
    // Lista com as minhas redes sociais e o identificador do ícone.
    redesSociais: [
        { nome: 'GitHub', url: 'https://github.com/joaoprocha35-dev/joaoprocha35-dev', icone: 'Github' },
        { nome: 'LinkedIn', url: 'https://www.linkedin.com/in/delmiro-rocha-b668043b0/', icone: 'Linkedin' },
        { nome: 'Instagram', url: 'https://www.instagram.com/zx.rochaa/', icone: 'Instagram' }
  ]
};