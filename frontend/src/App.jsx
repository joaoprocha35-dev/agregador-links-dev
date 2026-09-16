import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home/Home';
import { Login } from './pages/Login/Login';
import {Admin} from './pages/Admin/Admin';

export default function App() {
  return (
    <Routes>
      {/* Rota pública do portfólio */}
      <Route path="/" element={<Home />} />

      {/* Rota de acesso restrito */}
      <Route path="/login" element={<Login />} />

      {/* Rota do painel administrativo do DevHub */}
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}