import { Background } from '../../components/Background';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { BackButton } from '../../components/BackButton';
import { useLogin } from '../../hooks/useLogin';
import { Link } from 'react-router-dom'; // Para o "Esqueci minha senha"
import '../../styles/cadastro.css'; // Reutiliza o CSS do cadastro
import '../../styles/login.css'; // Estilos específicos do login

export function Login() {
  const { identificacao, setIdentificacao, senha, setSenha, handleLogin, erro, carregando } = useLogin();

  return (
    <Background>
      <div className="auth-container">
        <section className="form-section">
          <div className="auth-card">
            <BackButton to="/" />
            
            <h2>Login</h2>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '30px' }}>
              
              <Input 
                label="E-mail ou CPF" 
                placeholder="Digite seu e-mail ou CPF"
                value={identificacao}
                onChange={(e) => setIdentificacao(e.target.value)}
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Input 
                  label="Senha" 
                  type="password" 
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
                
                <Link to="/recuperar-senha" title="Esqueci minha senha"
                  style={{ alignSelf: 'flex-end', color: '#3ba1f2', fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none' }}>
                  Esqueci minha senha
                </Link>
              </div>

              {erro && <p style={{ color: '#ff4d4d', textAlign: 'center', fontSize: '0.9rem' }}>{erro}</p>}

              <div style={{ marginTop: '10px' }}>
                <Button type="submit" variant="primary" disabled={carregando}>
                  {carregando ? 'Entrando...' : 'Continuar'}
                </Button>
              </div>

              <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
                Ainda não tem uma conta? <Link to="/cadastro" style={{ color: '#3ba1f2', fontWeight: 600, textDecoration: 'none' }}>Cadastre-se</Link>
              </p>
            </form>
          </div>
        </section>

        <section className="image-section"></section>
      </div>
    </Background>
  );
}