// Aqui eu importo nosso componente reutilizável Badge (que criamos na pasta UI)
import { Badge } from '../UI/Badge';

// Aqui eu importo os dados do meu perfil salvos no arquivo de mock (src/data/projetos.js)
import { usuarioInfo } from '../../data/projetos';

// Aqui eu importo o CSS Module específico do Header
import styles from './Header.module.scss';

// Aqui estão os ícones atualizados em formato "Bloco Sólido", iguaizinhos à sua referência!
const iconesMap = {
  Github: () => (
    <svg viewBox="0 0 24 24" width="44" height="44" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.799 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  ),
  Linkedin: () => (
    <svg viewBox="0 0 24 24" width="44" height="44" xmlns="http://www.w3.org/2000/svg">
      {/* Fundo quadrado com bordas arredondadas azul */}
      <rect width="24" height="24" rx="5" fill="#0a66c2"/>
      {/* Letras 'in' vazadas em branco */}
      <path fill="#ffffff" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/>
    </svg>
  ),
 Instagram: () => (
    <svg viewBox="0 0 24 24" width="44" height="44" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Degradê oficial do Instagram */}
        <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f09433" />
          <stop offset="25%" stopColor="#e6683c" />
          <stop offset="50%" stopColor="#dc2743" />
          <stop offset="75%" stopColor="#cc2366" />
          <stop offset="100%" stopColor="#bc1888" />
        </linearGradient>
      </defs>
      {/* Fundo quadrado arredondado */}
      <rect width="24" height="24" rx="5" fill="url(#ig-grad)" />
      {/* Traço externo da câmera */}
      <rect x="5" y="5" width="14" height="14" rx="4" fill="none" stroke="#ffffff" strokeWidth="2" />
      {/* Lente central */}
      <circle cx="12" cy="12" r="3.5" fill="none" stroke="#ffffff" strokeWidth="2" />
      {/* Flash (bolinha superior direita) */}
      <circle cx="16.5" cy="7.5" r="1" fill="#ffffff" />
    </svg>
  ),
};

export const Header = () => {
  return (
    <header className={styles.header}>
      {/* Container da foto de perfil com aura ciano neon */}
      <div className={styles.avatarContainer}>
        <img 
          src={usuarioInfo.avatar} 
          alt={`Foto de perfil de ${usuarioInfo.nome}`} 
          className={styles.avatarImg}
        />
      </div>

      {/* Nome principal e Badge de Cargo */}
      <h1 className={styles.nome}>{usuarioInfo.nome}</h1>
      <Badge variant="cyan">[{usuarioInfo.cargo}]</Badge>

      {/* Barra de Redes Sociais em Glassmorphism */}
      <nav className={styles.socialNav}>
        {usuarioInfo.redesSociais.map((rede, index) => {
          const IconeComponente = iconesMap[rede.icone] || iconesMap.Github;

          return (
            <a
              key={index}
              href={rede.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={rede.nome}
              className={styles.socialLink}
            >
              <IconeComponente />
            </a>
          );
        })}
      </nav>
    </header>
  );
};