// Aqui eu importo os hooks do React que vou precisar para controlar o estado (Modal aberto/fechado) e as referências dos elementos na tela.
import { useState, useRef, useEffect } from 'react';

// Aqui eu importo a biblioteca GSAP para criar as animações fluidas de entrada.
import gsap from 'gsap';

// Aqui eu importo todos os componentes de UI que construímos nos passos anteriores.
import { Header } from './components/Header/Header';
import { Card } from './components/Card/Card';
import { Modal } from './components/Modal/Modal';

// Aqui eu importo os dados das categorias para desenhar os cards dinamicamente.
import { categoriasProjetos } from './data/projetos';

export default function App() {
  // Aqui eu crio o estado para guardar qual o ID da categoria que foi clicada (ex: 'b2b', 'autorais').
  const [categoriaAtivaId, setCategoriaAtivaId] = useState(null);
  
  // Aqui eu crio o estado para controlar se o Modal está visível (true) ou escondido (false).
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Aqui eu crio referências para o container principal e para a lista de cards, para o GSAP saber exatamente quem ele deve animar.
  const appRef = useRef(null);
  const cardsRef = useRef([]);

  // Aqui eu executo a animação do GSAP apenas uma vez, assim que o App carrega na tela.
  useEffect(() => {
    // Crio um contexto do GSAP atrelado ao nosso appRef para organizar as animações
    const ctx = gsap.context(() => {
      // Animo o Header surgindo de cima para baixo
      gsap.from('header', {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });

      // Animo os Cards surgindo de baixo para cima, um por um em efeito de cascata (stagger)
      gsap.from(cardsRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.3
      });
    }, appRef);

    // Limpo a animação da memória caso o componente seja desmontado (boa prática do React)
    return () => ctx.revert(); 
  }, []);

  // Aqui eu crio a função que o Card vai chamar quando for clicado.
  const handleAbrirModal = (id) => {
    setCategoriaAtivaId(id);
    setIsModalOpen(true);
  };

  // Aqui eu crio a função que o Modal vai chamar quando o usuário clicar no "X" ou fora dele.
  const handleFecharModal = () => {
    setIsModalOpen(false);
  };

  // Aqui eu procuro no meu mock de dados (projetos.js) a categoria completa correspondente ao ID ativo no momento.
  const categoriaAtiva = categoriasProjetos.find(cat => cat.id === categoriaAtivaId);

  return (
    // A div principal recebe a referência do GSAP e uma restrição de largura máxima para ficar centralizada no estilo "Linktree/Mobile".
    <div ref={appRef} style={{ maxWidth: '600px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* 1. Renderizo o cabeçalho com minha foto e redes */}
      <Header />

      {/* 2. Renderizo a lista de Cards */}
      <main style={{ padding: '0 20px' }}>
        {categoriasProjetos.map((categoria, index) => (
          <div 
            key={categoria.id} 
            // Salvo o elemento HTML deste card específico no meu array de referências para o GSAP animar depois
            ref={(el) => (cardsRef.current[index] = el)}
          >
            <Card 
              categoria={categoria} 
              onClick={handleAbrirModal} 
            />
          </div>
        ))}
      </main>

      {/* 3. Renderizo o Modal, passando se ele está aberto, a função de fechar e os dados para ele mostrar */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleFecharModal} 
        categoriaAtiva={categoriaAtiva} 
      />
    </div>
  );
}