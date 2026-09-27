import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  FolderGit2,
  Eye,
  Layers,
  Search,
  LogOut,
  Check,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./Admin.module.scss";

export const Admin = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // =========================================================================
  // ESTADOS DA APLICAÇÃO (Memória local do React)
  // =========================================================================
  const [projetos, setProjetos] = useState([]); // Guarda a lista de projetos do banco
  const [editingId, setEditingId] = useState(null); // Se tiver ID, estamos EDITANDO. Se for null, estamos CADASTRANDO.

  // Campos do Formulário
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [categoria, setCategoria] = useState("Frontend");
  const [status, setStatus] = useState("Em Produção"); // 'Em Produção', 'Projetos Autorais' ou 'Protótipos'
  const [descricao, setDescricao] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");

  // Estados para Upload e Preview de Imagem
  const [imagem, setImagem] = useState(null); // Guarda o arquivo binário selecionado
  const [previewImagem, setPreviewImagem] = useState(null); // Guarda a URL temporária da imagem para mostrar a miniatura

  // Outros estados de controle da interface
  const [busca, setBusca] = useState("");
  const [metricas, setMetricas] = useState({
    total_projetos: 0,
    categorias_ativas: 0,
    total_visitas: 0,
  });

  // =========================================================================
  // CARREGAMENTO INICIAL DE DADOS (GET)
  // =========================================================================
  useEffect(() => {
    // Busca métricas do painel
    const carregarMetricas = async () => {
      try {
        const token = localStorage.getItem("@DevHub:token");
        const response = await fetch("http://localhost:8000/api/metrics", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const dados = await response.json();
          setMetricas(dados);
        }
      } catch (error) {
        console.error("Erro ao buscar métricas do painel:", error);
      }
    };

    // Busca todos os projetos cadastrados
    const carregarProjetos = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/projetos");
        if (response.ok) {
          const dados = await response.json();
          setProjetos(dados);
        }
      } catch (error) {
        console.error("Erro ao buscar projetos:", error);
      }
    };

    carregarMetricas();
    carregarProjetos();
  }, []);

  // =========================================================================
  // FUNÇÕES DE AÇÃO DO USUÁRIO
  // =========================================================================

  // Executa a saída do sistema removendo a sessão
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  // Gerencia a seleção do arquivo de imagem e cria o link para miniatura
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagem(file);
      setPreviewImagem(URL.createObjectURL(file)); // Gera URL temporária do navegador
    } else {
      setImagem(null);
      setPreviewImagem(null);
    }
  };

  // Prepara o formulário com os dados do projeto para ser EDITADO
  const handleEdit = (proj) => {
    setEditingId(proj.id);
    setTitulo(proj.titulo || proj.nome || "");
    setSubtitulo(proj.subtitulo || "");
    setCategoria(proj.categoria || "Frontend");
    setStatus(proj.status || "Em Produção");
    setDescricao(proj.descricao || "");
    setDemoUrl(proj.demo_url || proj.demoUrl || "");
    setGithubUrl(proj.github_url || proj.githubUrl || "");

    // Mostra a imagem atual salva no banco como pré-visualização, se existir
    if (proj.imagem_url) {
      setPreviewImagem(proj.imagem_url);
    } else {
      setPreviewImagem(null);
    }

    window.scrollTo({ top: 0, behavior: "smooth" }); // Sobe a página suavemente para o formulário
  };

  // Cancela a edição e limpa todos os campos do formulário
  const handleCancelEdit = () => {
    setEditingId(null);
    setTitulo("");
    setSubtitulo("");
    setCategoria("Frontend");
    setStatus("Em Produção");
    setDescricao("");
    setDemoUrl("");
    setGithubUrl("");
    setImagem(null);
    setPreviewImagem(null);
  };

  // SUBMIT DO FORMULÁRIO (Criação [POST] ou Edição [PUT])
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Usamos FormData para empacotar os textos + a foto no mesmo envio
    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("subtitulo", subtitulo);
    formData.append("categoria", categoria);
    formData.append("status", status);
    formData.append("descricao", descricao);
    formData.append("demo_url", demoUrl);
    formData.append("github_url", githubUrl);

    // Só anexa o arquivo binário da imagem se o usuário tiver selecionado um novo arquivo
    if (imagem) {
      formData.append("imagem", imagem);
    }

    const token = localStorage.getItem("@DevHub:token");

    try {
      if (editingId) {
        // ===================================================================
        // ROTA DE EDIÇÃO (PUT) - Atualiza projeto existente no Banco
        // ===================================================================
        const response = await fetch(
          `http://localhost:8000/api/projetos/${editingId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              // Nota: Não colocar 'Content-Type' ao usar FormData!
            },
            body: formData,
          },
        );

        if (response.ok) {
          const projetoAtualizado = await response.json();

          // Atualiza a lista no estado trocando o projeto antigo pelo editado
          setProjetos(
            projetos.map((item) =>
              item.id === editingId ? projetoAtualizado : item,
            ),
          );
          handleCancelEdit(); // Reseta o formulário
        } else {
          console.error("Erro ao tentar atualizar o projeto no banco.");
        }
      } else {
        // ===================================================================
        // ROTA DE CRIAÇÃO (POST) - Cadastra novo projeto no Banco
        // ===================================================================
        const response = await fetch("http://localhost:8000/api/projetos", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (response.ok) {
          const projetoSalvo = await response.json();
          setProjetos([projetoSalvo, ...projetos]); // Coloca o novo projeto no topo da lista
          handleCancelEdit(); // Limpa os campos
        } else {
          console.error("Erro ao cadastrar o projeto no banco.");
        }
      }
    } catch (error) {
      console.error("Erro de conexão ao salvar projeto:", error);
    }
  };

  // EXCLUSÃO DE PROJETO (DELETE)
  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza de que deseja excluir este projeto?"))
      return;

    try {
      const token = localStorage.getItem("@DevHub:token");
      const response = await fetch(`http://localhost:8000/api/projetos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Remove da tela imediatamente
        setProjetos(projetos.filter((item) => item.id !== id));
      } else {
        console.error("Erro ao tentar deletar projeto no back-end.");
      }
    } catch (error) {
      console.error("Erro de conexão ao deletar:", error);
    }
  };

  // Filtra projetos em tempo real no campo de busca
  const projetosFiltrados = projetos.filter((p) =>
    (p.titulo || p.nome || "").toLowerCase().includes(busca.toLowerCase()),
  );

  return (
    <div className={styles.adminContainer}>
      {/* BARRA SUPERIOR (TOPBAR) */}
      <header className={styles.topbar}>
        <div className={styles.topbarHeader}>
          <div className={styles.brand}>
            <FolderGit2 size={20} className={styles.cyanIcon} />
            <span>
              DevHub <strong>Admin</strong>
            </span>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={16} /> <span>Sair</span>
          </button>
        </div>

        {/* BUSCA */}
        <div className={styles.searchBox}>
          <Search size={16} />
          <input
            type="text"
            placeholder="Buscar projetos no painel..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </header>

      {/* CARDS DE MÉTRICAS */}
      <section className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.iconWrapper}>
            <FolderGit2 size={20} />
          </div>
          <div>
            <p>Total de Projetos</p>
            <h3>{metricas.total_projetos}</h3>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.iconWrapper}>
            <Layers size={20} />
          </div>
          <div>
            <p>Categorias Ativas</p>
            <h3>{metricas.categorias_ativas}</h3>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.iconWrapper}>
            <Eye size={20} />
          </div>
          <div>
            <p>Visualizações Globais</p>
            <h3>{metricas.total_visitas}</h3>
          </div>
        </div>
      </section>

      {/* CONTEÚDO PRINCIPAL (FORMULÁRIO + LISTA) */}
      <main className={styles.mainContent}>
        {/* CARD DO FORMULÁRIO */}
        <div className={styles.formCard}>
          <h2>{editingId ? "Editar Projeto" : "Novo Projeto"}</h2>

          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label>Título do Projeto</label>
              <input
                type="text"
                placeholder="Ex: E-commerce React"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Subtítulo</label>
              <input
                type="text"
                placeholder="Ex: Uma solução completa de vendas..."
                value={subtitulo}
                onChange={(e) => setSubtitulo(e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Categoria Tecnológica</label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Fullstack">Fullstack</option>
                <option value="Mobile">Mobile</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label>Status / Tipo do Projeto</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Em Produção">Em Produção</option>
                <option value="Projetos Autorais">Projetos Autorais</option>
                <option value="Protótipos">Protótipos</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label>Descrição Curta</label>
              <textarea
                rows="3"
                placeholder="Resumo das tecnologias e objetivo do projeto..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Link do Projeto (Site ao vivo)</label>
              <input
                type="url"
                placeholder="https://meuprojeto.com"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Link do Repositório (GitHub)</label>
              <input
                type="url"
                placeholder="https://github.com/seu-usuario/projeto"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
              />
            </div>

            {/* CAMPO DE SELEÇÃO DE IMAGEM */}
            <div className={styles.inputGroup}>
              <label>Imagem de Capa</label>
              <div className={styles.fileUploadWrapper}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required={!editingId} // Na edição, a foto é opcional
                  className={styles.fileInput}
                />

                {/* MINIATURA DA IMAGEM */}
                {previewImagem && (
                  <div className={styles.imagePreview}>
                    <img src={previewImagem} alt="Pré-visualização da capa" />
                  </div>
                )}
              </div>
            </div>

            {/* BOTÕES DE AÇÃO */}
            <div className={styles.formActions}>
              <button
                type="submit"
                className={`${styles.saveBtn} ${styles.btnVerde}`}
              >
                {editingId ? <Check size={18} /> : <Plus size={18} />}
                {editingId ? "Salvar Alterações" : "Cadastrar Projeto"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={handleCancelEdit}
                >
                  <X size={18} /> Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* LISTA DE PROJETOS PARA GERENCIAR */}
        <div className={styles.listCard}>
          <h2>Gerenciar Projetos ({projetosFiltrados.length})</h2>

          <div className={styles.projectsTable}>
            {projetosFiltrados.map((item) => (
              <div key={item.id} className={styles.tableRow}>
                <div className={styles.info}>
                  <h4>{item.titulo || item.nome}</h4>
                  {/* Mostra a categoria tecnológica (ex: Frontend, Backend) */}
                  <span className={styles.badge}>
                    {item.categoria || "Geral"}
                  </span>
                  {/* Mostra o status apenas se for diferente da categoria */}
                  {item.status && (
                    <span
                      className={styles.badge}
                      style={{ marginLeft: "8px", opacity: 0.8 }}
                    >
                      {item.status}
                    </span>
                  )}
                </div>

                <div className={styles.actions}>
                  <button
                    className={styles.editBtn}
                    onClick={() => handleEdit(item)}
                    aria-label="Editar"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(item.id)}
                    aria-label="Excluir"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
