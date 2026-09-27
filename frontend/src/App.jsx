import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home/Home';
import { Login } from './pages/Login/Login';
import {Admin} from './pages/Admin/Admin';

//1. Importamos a nossa Nuvem de Memória e o nosso Segurança 
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';


export default function App() {
  return (
    //2. Abraçamos toda a aplicação com o AuthProvider

    <AuthProvider>

      <Routes>
        {/* Rota pública do portfólio */}
        <Route path="/" element={<Home />} />

        {/* Rota de login */}
        <Route path="/login" element={<Login />} />

        {/* Rota do painel admin protegida pelo segurança(ProductedRoute) do DevHub */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
            <Admin />
           </ProtectedRoute>
          } 
        />
      </Routes>
    </AuthProvider>
  );
}