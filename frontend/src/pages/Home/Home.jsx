import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Header } from '../../components/Header/Header';
import { Card } from '../../components/Card/Card';
import { Modal } from '../../components/Modal/Modal';
import { categoriasProjetos } from '../../data/projetos';
import styles from './Home.module.scss';

// Registro o plugin de rolagem do GSAP
gsap.registerPlugin(ScrollTrigger);

export const Home = () => {
  const [categoriaAtivaId, setCategoriaAtivaId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const appRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    // Inicializo os gatilhos de rolagem para os projetos
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

    return () => ctx.revert();
  }, []);

  const handleAbrirModal = (id) => {
    setCategoriaAtivaId(id);
    setIsModalOpen(true);
  };

  const handleFecharModal = () => setIsModalOpen(false);

  const categoriaAtiva = categoriasProjetos.find((cat) => cat.id === categoriaAtivaId);

  return (
    <div ref={appRef} className={styles.container}>
      <Header />

      <main className={styles.main}>
        {categoriasProjetos.map((categoria, index) => (
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