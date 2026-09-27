import { useEffect, useState } from "react";
import { X, ExternalLink, Code } from "lucide-react";
import { Badge } from "../UI/Badge";
import styles from "./Modal.module.scss";

// Componente para renderizar o ícone vetorial do WhatsApp no botão de orçamento
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

// Dicionário com os textos do botão de ação principal de acordo com o ID do card clicado
const ROTULOS_BOTAO_PRINCIPAL = {
  b2b: "Ver Site",
  autorais: "Ver Projeto",
  prototipos: "Ver Demo",
};

// Dicionário que traduz o "ID do card" para o nome exato do STATUS salvo no MySQL
const STATUS_MAPEAMENTO = {
  b2b: "Em Produção",
  autorais: "Projetos Autorais",
  prototipos: "Protótipos",
};

export const Modal = ({ isOpen, onClose, categoriaAtiva }) => {
  // Estado local para guardar a lista de projetos retornada pelo FastAPI
  const [projetosApi, setProjetosApi] = useState([]);
  // Estado para controlar a mensagem visual de "Carregando..." enquanto a requisição roda
  const [carregando, setCarregando] = useState(false);

 // Hook executado sempre que o Modal for aberto (isOpen muda) ou o card clicado trocar (categoriaAtiva)
  useEffect(() => {
    // Só faz a busca se o modal estiver aberto e houver uma categoria válida selecionada
    if (!isOpen || !categoriaAtiva) return;

    // Função assíncrona interna para buscar os dados
    const buscarProjetos = async () => {
      setCarregando(true); // Ativa o aviso de carregando

      try {
        const resposta = await fetch("http://localhost:8000/api/projetos");
        const listaCompleta = await resposta.json();

        // Identifica qual o status no banco que corresponde a este modal
        const statusEsperado = STATUS_MAPEAMENTO[categoriaAtiva.id];

        // Filtra a lista completa trazendo apenas os projetos com o mesmo status
        const projetosFiltrados = listaCompleta.filter(
          (projeto) =>
            projeto.status?.toLowerCase() === statusEsperado?.toLowerCase()
        );

        setProjetosApi(projetosFiltrados);
      } catch (erro) {
        console.error("Erro ao buscar projetos da API:", erro);
      } finally {
        setCarregando(false); // Desativa o aviso de carregando
      }
    };

    buscarProjetos();
  }, [isOpen, categoriaAtiva]);

  // Se o modal não estiver visível ou não tiver categoria definida, não renderiza nada no DOM
  if (!isOpen || !categoriaAtiva) return null;

  // Seleciona o rótulo do botão principal de acordo com a categoria selecionada
  const textoBotaoPrincipal =
    ROTULOS_BOTAO_PRINCIPAL[categoriaAtiva.id] || "Ver Demo";

  return (
    // Overlay de fundo escuro com fecho ao clicar fora do conteúdo
    <div className={styles.overlay} onClick={onClose}>
      {/* Container principal do Modal - e.stopPropagation impede o clique interno de fechar o modal */}
      <div
        className={`${styles.bottomSheet} ${styles[categoriaAtiva.corTema]}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão X para fechar */}
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Fechar modal"
        >
          <X size={20} />
        </button>

        {/* Cabeçalho do Modal dinâmico com título e subtítulo da categoria */}
        <div className={styles.header}>
          <h2>{categoriaAtiva.modalInfo?.tituloModal}</h2>
          <p>{categoriaAtiva.modalInfo?.subtituloModal}</p>
        </div>

        {/* CONDICIONAL 1: Exibe aviso enquanto a API responde */}
        {carregando ? (
          <div style={{ padding: "24px 0", textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
            <p>Carregando projetos...</p>
          </div>
        ) : 
        /* CONDICIONAL 2: Exibe mensagem se não houver projetos cadastrados para este status */
        projetosApi.length === 0 ? (
          <div style={{ padding: "24px 0", textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
            <p>Nenhum projeto cadastrado nesta categoria no momento.</p>
          </div>
        ) : (
          /* CONDICIONAL 3: Mapeia e renderiza cada projeto retornado do banco de dados */
          projetosApi.map((projeto) => (
            <article key={projeto.id} className={styles.projetoItem}>
              {/* Imagem enviada via Cloudinary (se existir) */}
              {projeto.imagem_url && (
                <img
                  src={projeto.imagem_url}
                  alt={projeto.titulo}
                  className={styles.imagem}
                />
              )}

              <div className={styles.conteudo}>
                {/* Título do Projeto do MySQL */}
                <h3>{projeto.titulo}</h3>

                {/* Badge da Categoria/Stack */}
                <div className={styles.tags}>
                  <Badge variant={categoriaAtiva.corTema}>
                    {projeto.categoria}
                  </Badge>
                </div>

                {/* Botões de links externos do projeto */}
                <div className={styles.botoes}>
                  {/* Link da Demonstração/Site (demo_url) */}
                  {projeto.demo_url && (
                    <a
                      href={projeto.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.btnPrincipal}
                    >
                      <ExternalLink size={16} /> {textoBotaoPrincipal}
                    </a>
                  )}

                  {/* Link do Repositório GitHub (github_url) */}
                  {projeto.github_url && (
                    <a
                      href={projeto.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Code size={16} /> Código
                    </a>
                  )}

                  {/* Botão do WhatsApp ativo apenas para serviços B2B */}
                  {categoriaAtiva.id === "b2b" && (
                    <a
                      href={`https://wa.me/5511999999999?text=Olá,%20tenho%20interesse%20no%20projeto%20${encodeURIComponent(
                        projeto.titulo
                      )}`}
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
          ))
        )}
      </div>
    </div>
  );
};