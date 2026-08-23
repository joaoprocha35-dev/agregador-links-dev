// Aqui eu importo a biblioteca do React para construir a estrutura do componente.
//import React from 'react'; não precisa usar pois nao estamos utilizando em lugar nenhum.

// Aqui eu importo os estilos modulares escopados do Badge.
import styles from './Badge.module.scss';

// Aqui eu crio e exporto o componente Badge.
// 'children' representa qualquer conteúdo/texto colocado entre <Badge>Texto</Badge>.
// 'variant' define qual cor neon será aplicada (padrão: 'cyan').
export const Badge = ({ children, variant = 'cyan' }) => {
  return (
    // Aqui eu combino a classe base .badge com a variação dinámica passada via props (.cyan, .purple ou .amber).
    <span className={`${styles.badge} ${styles[variant]}`}>
      {children}
    </span>
  );
};