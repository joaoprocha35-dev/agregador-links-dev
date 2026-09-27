import { createContext, useContext, useState } from 'react';

// 1. Aqui nós criamos a "nuvem" de memória. Ela nasce vazia.
const AuthContext = createContext();

// 2. Este é o provedor. Ele vai "abraçar" nosso aplicativo e fornecer os dados para todos.
export const AuthProvider = ({ children }) => {
//checamos se existe um ZToken salvo
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('@DevHub:token')
  })
  //Trasformamos a função em async porque a comunicação com a API pela internet demora  alguns segundos
  const login = async (email, password) => {
    try {
      // 1. Convertendo os dados para o formato de formulário exigido pelo OAuth2
      const formData = new URLSearchParams();
      formData.append('username', email); // O FastAPI exige o nome 'username'
      formData.append('password', password);

      // 2. Rota corrigida e Content-Type ajustado
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded' 
        },
        body: formData,
      });

      if(response.ok) {
        const data = await response.json(); 
        
        // 3. Corrigido erro de digitação de acess_token para access_token
        localStorage.setItem('@DevHub:token', data.access_token);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    }catch(error){
      console.error('Erro ao tentar conectar na API:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('@DevHub:token'); // joga o crachá VIP no lixo
    setIsAuthenticated(false);
  }

  return(
    <AuthContext.Provider value={{isAuthenticated, login, logout}}>
      {children}
    </AuthContext.Provider>
  );

};

//eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);