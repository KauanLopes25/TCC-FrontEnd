import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Cadastro } from './pages/Cadastro';
// Importe outras telas que você for criando no futuro:
// import { Welcome } from './pages/Welcome';
 import { Login } from './pages/Login';
import { Welcome } from './pages/Welcome';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} /> {/* Login como tela inicial se preferir */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
      </Routes>
    </BrowserRouter>
  );
}