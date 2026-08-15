// Aqui eu importo os ícones de ação para os botões dos projetos e o de fechar o Modal.
import { X, ExternalLink, Code, MessageCircle } from "lucide-react";

// Aqui eu importo o Badge para usar nas tecnologias (tags) de cada projeto.
import { Badge } from "../UI/Badge";

// Aqui eu importo os estilos isolados do Modal.
import styles from "./Modal.module.scss";

// Aqui eu crio o Modal. Ele recebe se está aberto (isOpen), a função para fechar (onClose) e os dados da categoria ativa.
export const Modal = ({ isOpen, onClose, categoriaAtiva }) => {
  // Se o Modal não estiver aberto ou não tivermos uma categoria selecionada, eu não renderizo nada (retorno null).
  if (!isOpen || !categoriaAtiva) return null;

  return (
    // Quando eu clico no overlay (fundo escuro), eu disparo o onClose para fechar o Modal.
    <div className={styles.overlay} onClick={onClose}>
      {/* Aqui é a caixa principal do Modal. Uso e.stopPropagation() para que clicar dentro do Modal não acione o fechamento do overlay. */}
      <div
        className={`${styles.bottomSheet} ${styles[categoriaAtiva.corTema]}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Fechar modal"
        >
          <X size={20} />
        </button>

        <div className={styles.header}>
          <h2>{categoriaAtiva.modalInfo.tituloModal}</h2>
          <p>{categoriaAtiva.modalInfo.subtituloModal}</p>
        </div>

        {/* Aqui eu faço um loop (map) por todos os projetos que pertencem a esta categoria e desenho um card para cada um. */}
        {categoriaAtiva.modalInfo.projetos.map((projeto) => (
          <article key={projeto.id} className={styles.projetoItem}>
            <img
              src={projeto.imagem}
              alt={projeto.nome}
              className={styles.imagem}
            />

            <div className={styles.conteudo}>
              <h3>{projeto.nome}</h3>

              <div className={styles.tags}>
                {/* Outro loop para desenhar as tags de tecnologia do projeto usando o nosso componente Badge */}
                {projeto.tags.map((tag, index) => (
                  <Badge key={index} variant={categoriaAtiva.corTema}>
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className={styles.botoes}>
                {/* Se existir um link para o site, exibo o botão de Ver Deploy */}
                {projeto.linkSite && (
                  <a
                    href={projeto.linkSite}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink size={16} /> Ver Demo
                  </a>
                )}
                {/* Se existir um link para o código (ex: GitHub), exibo o botão de Repositório */}
                {projeto.linkCodigo && (
                  <a
                    href={projeto.linkCodigo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Code size={16} /> Código
                  </a>
                )}
                {/* Se for um protótipo e tiver link pro WhatsApp, exibo o botão de Demo */}
                {projeto.linkWhatsApp && (
                  <a
                    href={projeto.linkWhatsApp}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle size={16} /> Solicitar Orçamento
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
