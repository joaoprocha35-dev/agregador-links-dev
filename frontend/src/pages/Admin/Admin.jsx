import { useState } from 'react';
import { Plus, Trash2, Edit3, FolderGit2, Eye, Layers, Search, LogOut, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { categoriasProjetos } from '../../data/projetos';
import styles from './Admin.module.scss';

export const Admin = () => {
  const navigate = useNavigate();

  // Lista principal de projetos carregada do estado
  const [projetos, setProjetos] = useState(categoriasProjetos);
  
  // Estados para controle do formulário de cadastro/edição
  const [editingId, setEditingId] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('Frontend');
  const [descricao, setDescricao] = useState('');
  const [busca, setBusca] = useState('');

  // Salva um novo projeto ou aplica as edições
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      setProjetos(projetos.map(item => item.id === editingId ? { ...item, titulo, categoria, descricao } : item));
      setEditingId(null);
    } else {
      const novoProjeto = { id: Date.now(), titulo, categoria, descricao, repositorios: [] };
      setProjetos([novoProjeto, ...projetos]);
    }

    setTitulo('');
    setDescricao('');
  };

  // Carrega os dados do projeto no formulário para editar
  const handleEdit = (proj) => {
    setEditingId(proj.id);
    setTitulo(proj.titulo || proj.nome);
    setCategoria(proj.categoria || 'Frontend');
    setDescricao(proj.descricao || '');
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola até o topo no celular
  };

  // Remove um projeto da lista
  const handleDelete = (id) => {
    setProjetos(projetos.filter(item => item.id !== id));
  };

  // Cancela a edição atual e limpa os campos
  const handleCancelEdit = () => {
    setEditingId(null);
    setTitulo('');
    setDescricao('');
  };

  // Filtra projetos conforme o termo digitado na busca
  const projetosFiltrados = projetos.filter(p => 
    (p.titulo || p.nome || '').toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className={styles.adminContainer}>
      
      {/* Topbar compacta adaptada para celular e desktop */}
      <header className={styles.topbar}>
        <div className={styles.topbarHeader}>
          <div className={styles.brand}>
            <FolderGit2 size={20} className={styles.cyanIcon} />
            <span>DevHub <strong>Admin</strong></span>
          </div>

          <button className={styles.logoutBtn} onClick={() => navigate('/login')}>
            <LogOut size={16} /> <span>Sair</span>
          </button>
        </div>

        {/* Campo de busca em linha cheia no celular */}
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

      {/* Grid de métricas responsivo */}
      <section className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.iconWrapper}><FolderGit2 size={20} /></div>
          <div>
            <p>Total de Projetos</p>
            <h3>{projetos.length}</h3>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.iconWrapper}><Layers size={20} /></div>
          <div>
            <p>Categorias Ativas</p>
            <h3>4</h3>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.iconWrapper}><Eye size={20} /></div>
          <div>
            <p>Visualizações Globais</p>
            <h3>1.248</h3>
          </div>
        </div>
      </section>

      {/* Área principal em coluna única no mobile e 2 colunas no desktop */}
      <main className={styles.mainContent}>
        
        {/* Card do Formulário com brilho azul */}
        <div className={styles.formCard}>
          <h2>{editingId ? 'Editar Projeto' : 'Novo Projeto'}</h2>
          
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
              <label>Categoria</label>
              <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Fullstack">Fullstack</option>
                <option value="Mobile">Mobile</option>
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

            <div className={styles.formActions}>
              <button type="submit" className={styles.saveBtn}>
                {editingId ? <Check size={18} /> : <Plus size={18} />}
                {editingId ? 'Salvar Alterações' : 'Cadastrar Projeto'}
              </button>

              {editingId && (
                <button type="button" className={styles.cancelBtn} onClick={handleCancelEdit}>
                  <X size={18} /> Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Lista de Projetos gerenciáveis */}
        <div className={styles.listCard}>
          <h2>Gerenciar Projetos ({projetosFiltrados.length})</h2>

          <div className={styles.projectsTable}>
            {projetosFiltrados.map((item) => (
              <div key={item.id} className={styles.tableRow}>
                <div className={styles.info}>
                  <h4>{item.titulo || item.nome}</h4>
                  <span className={styles.badge}>{item.categoria || 'Geral'}</span>
                </div>

                <div className={styles.actions}>
                  <button className={styles.editBtn} onClick={() => handleEdit(item)} aria-label="Editar">
                    <Edit3 size={16} />
                  </button>
                  <button className={styles.deleteBtn} onClick={() => handleDelete(item.id)} aria-label="Excluir">
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