// Importo os ícones utilitários da Lucide, a pílula visual reutilizável de Badge e os estilos isolados
import { X, ExternalLink, Code } from "lucide-react";
import { Badge } from "../UI/Badge";
import styles from "./Modal.module.scss";

// Construí este elemento vetorial para desenhar o símbolo circular do WhatsApp sem depender de pacotes externos
const WhatsAppIcon = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.434 5.174L2 22l4.957-1.3C8.423 21.547 10.158 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm4.511 14.186c-.248.694-1.433 1.335-1.975 1.386-.499.047-1.152.085-3.328-.797-2.785-1.129-4.573-3.962-4.712-4.148-.139-.186-1.13-1.504-1.13-2.87 0-1.365.717-2.037.974-2.31.257-.273.56-.341.747-.341.187 0 .373.003.536.01.176.007.411.015.596.453.186.44.636 1.554.691 1.666.056.112.093.243.019.393-.074.149-.111.241-.223.372-.112.13-.235.292-.337.391-.112.112-.229.233-.099.457.13.224.579.955 1.243 1.545.855.762 1.577.997 1.801 1.109.224.112.355.093.485-.056.13-.149.56-.653.709-.877.149-.224.299-.187.504-.112.205.075 1.308.617 1.532.729.224.112.373.168.429.262.056.093.056.542-.191 1.236z" />
  </svg>
);

// Mapeio os textos dos botões principais combinando exatamente com as chaves do meu arquivo de dados
const ROTULOS_BOTAO_PRINCIPAL = {
  b2b: "Ver Site",
  autorais: "Ver Projeto",
  prototipos: "Ver Demo",
};

// Declaro o modal recebendo os estados de controle e o objeto da categoria selecionada
export const Modal = ({ isOpen, onClose, categoriaAtiva }) => {
  // Interrompo a renderização imediatamente se o painel estiver fechado ou sem informações
  if (!isOpen || !categoriaAtiva) return null;

  // Resgato o rótulo dinâmico correspondente ao ID atual e defino um valor padrão de garantia
  const textoBotaoPrincipal =
    ROTULOS_BOTAO_PRINCIPAL[categoriaAtiva.id] || "Ver Demo";

  return (
    // Desenho a camada escura de fundo e vinculo o fechamento ao clicar fora da caixa
    <div className={styles.overlay} onClick={onClose}>
      {/* Criei este contêiner flutuante injetando a classe de cor tema e bloqueando a propagação de cliques */}
      <div
        className={`${styles.bottomSheet} ${styles[categoriaAtiva.corTema]}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Adiciono o acionador para fechar a interface manualmente */}
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Fechar modal"
        >
          <X size={20} />
        </button>

        {/* Exibo o cabeçalho informativo extraído da categoria */}
        <div className={styles.header}>
          <h2>{categoriaAtiva.modalInfo.tituloModal}</h2>
          <p>{categoriaAtiva.modalInfo.subtituloModal}</p>
        </div>

        {/* Percorro o array de projetos cadastrados para gerar os cartões individuais */}
        {categoriaAtiva.modalInfo.projetos.map((projeto) => (
          <article key={projeto.id} className={styles.projetoItem}>
            <img
              src={projeto.imagem}
              alt={projeto.nome}
              className={styles.imagem}
            />

            <div className={styles.conteudo}>
              <h3>{projeto.nome}</h3>

              {/* Transformo o array de tecnologias em marcas visuais customizadas */}
              <div className={styles.tags}>
                {projeto.tags.map((tag, index) => (
                  <Badge key={index} variant={categoriaAtiva.corTema}>
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Agrupo os hiperlinks de ação do projeto */}
              <div className={styles.botoes}>
                {/* Renderizo o botão primário estilizado conforme a categoria */}
                {projeto.linkSite && (
                  <a
                    href={projeto.linkSite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.btnPrincipal}
                  >
                    <ExternalLink size={16} /> {textoBotaoPrincipal}
                  </a>
                )}

                {/* Exibo a opção de código-fonte quando o repositório estiver disponível */}
                {projeto.linkCodigo && (
                  <a
                    href={projeto.linkCodigo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Code size={16} /> Código
                  </a>
                )}

                {/* Direciono para o contato do WhatsApp usando meu novo ícone circular */}
                {projeto.linkWhatsApp && (
                  <a
                    href={projeto.linkWhatsApp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.whatsapp}
                  >
                    <WhatsAppIcon size={16} /> Solicitar Orçamento
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