import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importação das Telas (Pages)
import { Welcome } from '../pages/Welcome';
import { Login } from '../pages/Login';
import { Cadastro } from '../pages/Cadastro';
import { RecuperarSenha } from '../pages/RecuperarSenha';
import { Lavanderias } from '../pages/Lavanderias';
import { Home } from '../pages/Home';
import { MeusPedidos } from '../pages/MeusPedidos';
import { AcompanhamentoPedido } from '../pages/AcompanhamentoPedido';
import { DashboardLayout } from '../layouts/DashboardLayout';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        
        {/* ✅ TUDO QUE ESTÁ AQUI DENTRO GANHA O MENU LATERAL AUTOMATICAMENTE */}
        <Route element={<DashboardLayout/>}>
          <Route path="/home" element={<Home/>}/>
          <Route path="/lavanderias" element={<Lavanderias />} />
          <Route path="/pedidos" element={<MeusPedidos/>}/>
          <Route path="/acompanhamento" element={<AcompanhamentoPedido/>}/>
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}