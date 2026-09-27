import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Header } from '../../components/Header/Header';
import { Card } from '../../components/Card/Card';
import { Modal } from '../../components/Modal/Modal';
import { categoriasProjetos as categoriasIniciais } from '../../data/projetos';
import styles from './Home.module.scss';

// Registra o plugin de animações de rolagem da biblioteca GSAP
gsap.registerPlugin(ScrollTrigger);

export const Home = () => {
  // Estado que armazena as categorias e os projetos carregados dinamicamente
  const [categorias, setCategorias] = useState(categoriasIniciais);
  
  // Estado que guarda o ID da categoria que o usuário clicou (ex: 'b2b')
  const [categoriaAtivaId, setCategoriaAtivaId] = useState(null);
  
  // Estado que controla a exibição (aberto/fechado) do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Referências do DOM para controle das animações do GSAP
  const appRef = useRef(null);
  const cardsRef = useRef([]);

  // =========================================================================
  // 1. EFEITO: Animações visuais de entrada dos Cards via GSAP
  // =========================================================================
  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card) => {
        if (!card) return;

        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 82%',
            toggleActions: 'play none none reverse',
          },
          y: 45,
          opacity: 0,
          duration: 0.65,
          ease: 'power3.out',
        });
      });
    }, appRef);

    // Função de limpeza executada quando o componente desmonta
    return () => ctx.revert();
  }, []);

  // =========================================================================
  // 2. EFEITO: Comunicação com a API (Visitas + Carregamento de Projetos)
  // =========================================================================
  useEffect(() => {
    // A) Registro de Visita Global (Apenas para usuários normais, ignora o Admin)
    const token = localStorage.getItem('@DevHub:token');
    if (!token) {
      fetch('http://localhost:8000/api/visitas/registrar', {
        method: 'POST',
      }).catch((err) => console.error('Erro ao registrar visita:', err));
    }

    // B) Busca os projetos cadastrados no banco MySQL via FastAPI
    const carregarProjetosDoBackend = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/projetos');
        if (!response.ok) return;

        const projetosDoBanco = await response.json();

        // Atualiza o estado 'categorias' mapeando os projetos recebidos para suas respectivas áreas
        setCategorias((categoriasAtuais) =>
          categoriasAtuais.map((cat) => {
            // Filtra apenas os projetos que pertencem ao ID desta categoria (ex: 'b2b', 'autorais', 'prototipos')
            const projetosDaCategoria = projetosDoBanco
              .filter((p) => p.categoria === cat.id)
              .map((p) => ({
                id: p.id,
                nome: p.titulo,
                subtitulo: p.subtitulo,
                descricao: p.descricao,
                imagem: p.imagem_url || 'https://via.placeholder.com/400x250',
                linkSite: p.demo_url,
                linkCodigo: p.github_url,
                tags: p.tags || [],
              }));

            return {
              ...cat,
              modalInfo: {
                ...cat.modalInfo,
                projetos: projetosDaCategoria,
              },
            };
          })
        );
      } catch (error) {
        console.error('Erro ao conectar com o servidor:', error);
      }
    };

    carregarProjetosDoBackend();
  }, []); // Executa apenas uma vez no carregamento da página

  // Abre o modal atribuindo a categoria clicada
  const handleAbrirModal = (id) => {
    setCategoriaAtivaId(id);
    setIsModalOpen(true);
  };

  // Fecha a janela do modal
  const handleFecharModal = () => setIsModalOpen(false);

  // Identifica o objeto completo da categoria selecionada pelo usuário
  const categoriaAtiva = categorias.find((cat) => cat.id === categoriaAtivaId);

  return (
    <div ref={appRef} className={styles.container}>
      <Header />

      <main className={styles.main}>
        {categorias.map((categoria, index) => (
          <div 
            key={categoria.id} 
            ref={(el) => (cardsRef.current[index] = el)}
          >
            <Card 
              categoria={categoria} 
              onClick={handleAbrirModal} 
            />
          </div>
        ))}
      </main>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleFecharModal} 
        categoriaAtiva={categoriaAtiva} 
      />
    </div>
  );
};