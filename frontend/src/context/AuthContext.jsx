import { createContext, useContext, useState } from 'react';

// 1. Aqui nós criamos a "nuvem" de memória. Ela nasce vazia.
const AuthContext = createContext();

// 2. Este é o provedor. Ele vai "abraçar" nosso aplicativo e fornecer os dados para todos.
export const AuthProvider = ({ children }) => {
  
  // Estado que guarda se o usuário está logado ou não.
  // Usamos o localStorage (memória do navegador) para que se o usuário der F5, ele não deslogue.
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('@DevHub:auth') === 'true';
  });

  // Função que simula o ato de logar
  const login = (email, password) => {
    // Por enquanto, se ele preencher qualquer email e senha, a gente deixa entrar.
    if (email && password) {
      localStorage.setItem('@DevHub:auth', 'true'); // Salva no navegador
      setIsAuthenticated(true); // Atualiza nossa nuvem
      return true; // Retorna sucesso
    }
    return false;
  };

  // Função para sair (logout)
  const logout = () => {
    localStorage.removeItem('@DevHub:auth'); // Limpa a memória do navegador
    setIsAuthenticated(false); // Atualiza a nuvem para falso
  };

  // 3. Aqui disponibilizamos as funções e o status para quem quiser usar
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. Criamos um "atalho" (Hook customizado) para facilitar na hora de usar essa nuvem nas telas.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);