import { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import styles from './Login.module.scss';

export const Login = () => {
  // Estados para salvar o e-mail e a senha digitados
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Cancela o recarregamento da página e processa os dados
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Tentativa de login:', { email, password });
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
              />
            </div>
          </div>

          {/* Botão de confirmação */}
          <button type="submit" className={styles.submitBtn}>
            Entrar no Painel <ArrowRight size={18} />
          </button>
          
        </form>
      </div>
    </div>
  );
};