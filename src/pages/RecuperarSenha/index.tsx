import { Link, useNavigate } from 'react-router-dom';
import { useRecuperacaoSenha } from '../../hooks/useRecuperarSenha';
import { Button } from '../../components/Button';
// Importe o arquivo CSS onde estão essas regras globais (ou o específico se separou)
import '../Cadastro/cadastro.css'; 

export function RecuperarSenha() {
  const navigate = useNavigate();
  const { estado, setters, acoes } = useRecuperacaoSenha(() => navigate('/login'));

  return (
    <div className="auth-container">
      
      {/* =========================================
          LADO ESQUERDO: ÁREA DO FORMULÁRIO
          ========================================= */}
      <div className="form-section">
        <div className="auth-card">
          <h2>Recuperar Senha</h2>
          
          <p className="password-requirements" style={{ textAlign: 'center', marginBottom: '15px' }}>
            {estado.etapa === 1 
              ? 'Digite o e-mail cadastrado para receber o código de recuperação.' 
              : `Insira o código enviado para o e-mail ${estado.email} e crie sua nova senha.`}
          </p>

          {/* FEEDBACKS DE ERRO E SUCESSO */}
          {estado.mensagemErro && (
            <span className="error-text" style={{ textAlign: 'center', display: 'block', marginBottom: '15px' }}>
              {estado.mensagemErro}
            </span>
          )}
          {estado.mensagemSucesso && (
            <span style={{ display: 'block', color: '#1e8e3e', fontSize: '0.9rem', fontWeight: 500, textAlign: 'center', marginBottom: '15px' }}>
              {estado.mensagemSucesso}
            </span>
          )}

          {/* =========================================
              GRID DOS INPUTS (Usando sua classe .form-grid)
              ========================================= */}
          <div className="form-grid">
            
            {estado.etapa === 1 ? (
              // --- PASSO 1: SÓ O E-MAIL ---
              <>
                <div className="input-container full-width">
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#444', marginBottom: '8px' }}>E-mail</label>
                  <input 
                    type="email" 
                    placeholder="exemplo@email.com"
                    value={estado.email}
                    onChange={(e) => setters.setEmail(e.target.value)}
                    disabled={estado.carregando}
                    style={{ width: '100%', padding: '12px 5px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none' }}
                  />
                </div>

                <div className="btn-wrapper full-width">
                  <Button 
                    variant="primary" 
                    onClick={acoes.enviarCodigo} 
                    isLoading={estado.carregando}
                    disabled={estado.carregando}
                    style={{ width: '100%' }}
                  >
                    {estado.carregando ? 'Enviando...' : 'Receber Código'}
                  </Button>
                </div>
              </>
            ) : (
              // --- PASSO 2: TOKEN E NOVA SENHA ---
              <>
                <div className="input-container full-width">
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#444', marginBottom: '8px' }}>Código de Verificação</label>
                  <input 
                    type="text" 
                    placeholder="Digite o código de acesso"
                    value={estado.token}
                    onChange={(e) => setters.setToken(e.target.value)}
                    disabled={estado.carregando}
                    style={{ width: '100%', padding: '12px 5px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none' }}
                  />
                </div>

                <div className="input-container full-width">
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#444', marginBottom: '8px' }}>Nova Senha</label>
                  <input 
                    type="password" 
                    placeholder="Mínimo de 8 caracteres"
                    value={estado.novaSenha}
                    onChange={(e) => setters.setNovaSenha(e.target.value)}
                    disabled={estado.carregando}
                    style={{ width: '100%', padding: '12px 5px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none' }}
                  />
                </div>

                <div className="btn-wrapper full-width">
                  <Button 
                    variant="primary" 
                    onClick={acoes.confirmarNovaSenha} 
                    disabled={estado.carregando}
                    style={{ width: '100%' }}
                  >
                    {estado.carregando ? 'Atualizando...' : 'Alterar Senha'}
                  </Button>

                  {/* Botão sutil para voltar caso o usuário tenha digitado o email errado */}
                  <button 
                    onClick={() => setters.setEtapa(1)}
                    disabled={estado.carregando}
                    style={{ background: 'none', border: 'none', color: '#666', fontSize: '0.9rem', fontWeight: 600, marginTop: '15px', cursor: 'pointer', width: '100%' }}
                  >
                    Tentar outro e-mail
                  </button>
                </div>
              </>
            )}
          </div>

          {/* =========================================
              RODAPÉ DO CARD (Voltar ao Login com Link)
              ========================================= */}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <span style={{ color: '#666', fontSize: '0.9rem' }}>Lembrou sua senha? </span>
            <Link 
              to="/login" 
              style={{ color: '#3ba1f2', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none' }}
            >
              Voltar para o Login
            </Link>
          </div>

        </div>
      </div>

      {/* =========================================
          LADO DIREITO: IMAGEM DA MÁQUINA DE LAVAR
          (A classe image-section já puxa o background via CSS)
          ========================================= */}
      <div className="image-section"></div>

    </div>
  );
}