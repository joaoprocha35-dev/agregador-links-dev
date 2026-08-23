// Aqui eu importo o ícone de seta da biblioteca Lucide para mostrar ao usuário que ele pode clicar no card.
import { ArrowRight } from 'lucide-react';

// Aqui eu trago a nossa Pílula/Badge para reutilizarmos no topo do card.
import { Badge } from '../UI/Badge';

// Aqui eu importo o arquivo de estilos modulares que acabei de criar.
import styles from './Card.module.scss';

// Aqui eu construo o componente Card. Ele recebe os dados de uma 'categoria' e uma função 'onClick'.
export const Card = ({ categoria, onClick }) => {
  return (
    // Quando o usuário clicar nesta div inteira, ela aciona o onClick repassando o ID da categoria (ex: 'b2b').
    // O styles[categoria.corTema] aplica a classe correspondente para o brilho neon (cyan, purple ou amber).
    <div 
      className={`${styles.card} ${styles[categoria.corTema]}`} 
      onClick={() => onClick(categoria.id)}
    >
      {/* 1. Aqui eu coloco a Imagem de fundo e a Película de escurecimento para dar contraste */}
      <img 
        src={categoria.imagemFundo} 
        alt={categoria.titulo} 
        className={styles.bgImage} 
      />
      <div className={styles.overlay}></div>

      {/* 2. Este container agrupa todo o conteúdo (textos e ícones) para que flutuem por cima da imagem */}
      <div className={styles.contentWrapper}>
        
        {/* Alinhamento do topo do card */}
        <div className={styles.header}>
          {/* Renderizo o Badge usando a cor e o texto vindos dos nossos dados */}
          <Badge variant={categoria.corTema}>
            {categoria.badge}
          </Badge>
          
          {/* Ícone da setinha */}
          <div className={styles.iconContainer}>
            <ArrowRight size={20} />
          </div>
        </div>

        {/* Textos inferiores do card */}
        <div className={styles.content}>
          <span className={styles.subtitulo}>{categoria.subtitulo}</span>
          <h2 className={styles.titulo}>{categoria.titulo}</h2>
        </div>

      </div>
    </div>
  );
};