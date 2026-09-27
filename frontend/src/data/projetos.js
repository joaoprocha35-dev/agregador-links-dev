import avatar from '../assets/avatar.png'
import card01 from '../assets/card01.png';
import card02 from '../assets/card02.png';
import card03 from '../assets/card03.png';

// Removi as importações de b2b_irondome e projeto_cardapio, pois esses dados virão do banco.

export const categoriasProjetos = [
    {
        id: 'b2b',
        badge: '🌐 EM PRODUÇÃO',
        subtitulo: 'SOLUÇÕES EMPRESARIAIS',
        titulo: 'Sistemas Personalizados',
        imagemFundo: card01,
        corTema: 'cyan',
        modalInfo: {
            tituloModal: 'Projetos em Produção',
            subtituloModal: 'Sistemas reais desenvolvidos para clientes B2B',
            // A lista de projetos começa vazia. O React (via useEffect) a preencherá com dados do MySQL.
            projetos: [] 
        }
    },
    {
        id: 'autorais',
        badge: '💡 PROJETOS AUTORAIS',
        subtitulo: 'WEB & MOBILE DESIGN + DEV',
        titulo: 'Aplicações Autorais',
        imagemFundo: card02,
        corTema: 'purple',
        modalInfo: {
            tituloModal: 'Lab & Projetos Autorais',
            subtituloModal: 'Aplicações criadas para explorar novas tecnologias e UI/UX',
             // A lista de projetos começa vazia.
            projetos: []
        }
    },
    {
        id: 'prototipos',
        badge: '⚙️ PROTÓTIPOS',
        subtitulo: 'SOLICITE UMA DEMO',
        titulo: 'Conceitos de Inovação',
        imagemFundo: card03,
        corTema: 'amber',
        modalInfo: {
            tituloModal: 'Conceitos & Protótipos',
            subtituloModal: 'Demonstrações técnicas prontas para customização',
             // A lista de projetos começa vazia.
            projetos: []
        }
    }
];

export const usuarioInfo = {
    nome: 'João Rocha',
    cargo: 'Desenvolvedor WebDesign',
    avatar: avatar,
    redesSociais: [
        { nome: 'GitHub', url: 'https://github.com/joaoprocha35-dev/joaoprocha35-dev', icone: 'Github' },
        { nome: 'LinkedIn', url: 'https://www.linkedin.com/in/delmiro-rocha-b668043b0/', icone: 'Linkedin' },
        { nome: 'Instagram', url: 'https://www.instagram.com/zx.rochaa/', icone: 'Instagram' }
    ]
};