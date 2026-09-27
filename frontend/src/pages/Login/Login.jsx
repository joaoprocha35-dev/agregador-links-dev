import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; //irá fazer a navegação para a telam /adim se o email e o password estiver correto.
import { useAuth } from '../../context/AuthContext'; //tras consigo as funções de login, logout etc.Faz a comunicação e salva os dados na memoria do navegador
import { Lock, Mail, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import styles from './Login.module.scss';

export const Login = () => {
  // Estados para salvar o e-mail e a senha digitados
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Estado para exibir mensagem de erro
  const [isLoading, setIsLoading] = useState(false); // controle do botão

  const {login} = useAuth(); // faz a conexão com o banco e tem acesso a função do arquivo AuthContext.jsx
  const navigate = useNavigate(); // faz a navegação

  
  // Cancela o recarregamento da página e processa os dados
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('') // limpa o erro antes de tentar novamente
    setIsLoading(true); //O usuário clicou: 'damos um sinal de que o botao foi clicado'

    //chama o backend e aguarda a resposta
    const isSuccess = await login(email,password);

    if (isSuccess){
      navigate('/admin'); // faz a navegação para a tela admin automaticamente
    } else{
      setError('Acesso negado!') // Exibe o erro na tela
      setIsLoading(false) // Deu erro: tiramos o sinal do botão para que ele possa apertar de novo
    }
  };

  return (
    /* Container principal centralizado na tela */
    <div className={styles.container}>
      
      {/* Card estilo glassmorphism */}
      <div className={styles.loginCard}>
        
        {/* Cabeçalho do formulário */}
        <div className={styles.header}>
          {/* Badge de identificação do DevHub */}
          <div className={styles.badgeDev}>
            <ShieldCheck size={14} /> DEV HUB
          </div>

          {/* Título com brilho fluorescente */}
          <h1 className={styles.fluorescentTitle}>
            Bem-vindo ao <span>DevHub</span>
          </h1>

          <p className={styles.subtitle}>Área restrita para gestão do portfólio</p>
        </div>

        {/* Formulário de login */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Se a variável error tiver texto, renderiza esta div na tela */}
          {error && <div style={{ color: '#ee1d1d', fontSize: '13px', textAlign: 'center' }}>{error}</div>}

          {/* Campo de E-mail */}
          <div className={styles.inputGroup}>
            <label htmlFor="email">E-mail</label>
            <div className={styles.inputWrapper}>
              <Mail size={18} className={styles.icon} />
              <input
                type="email"
                id="email"
                placeholder="seu.email@devhub.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading} //Bloqueia a digitação enquanto carrega
              />
            </div>
          </div>

          {/* Campo de Senha */}
          <div className={styles.inputGroup}>
            <label htmlFor="password">Senha</label>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.icon} />
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading} //bloqueia
              />
            </div>
          </div>

          {/* Botão de confirmação dinamico */}
          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={isLoading} //Trava o botão para não receber novos cliques
            style={{opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer'}}
          >
            {isLoading ? (
                <>
                  Autenticando... <Loader2 size={18} className={styles.spinner} style={{animation: 'spin 1s linear infinite'}}/>
                </>
              ) : (
                <>
                  Entrar no Painel <ArrowRight size={18}/>
                </>
              )}
          </button>
          
        </form>
      </div>
    </div>
  );
};