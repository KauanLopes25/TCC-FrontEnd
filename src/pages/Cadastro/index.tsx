import { Background } from '../../components/Background';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { BackButton } from '../../components/BackButton';
import { useCadastro } from '../../hooks/useCadastro';
import './cadastro.css';

export function Cadastro() {
  const { form, acoes, erros } = useCadastro();

  // Bloqueia se o CEP estiver preenchido OU se o cadastro já tiver dado sucesso
  const deveBloquearCampos = form.cep.replace(/\D/g, '').length === 8 || !!form.sucesso;
  const telaBloqueadaPorSucesso = !!form.sucesso;

  return (
    <Background>
      <div className="auth-container">
        <section className="form-section">
          <div className="auth-card">
            <BackButton to="/" />

            <h2>Cadastre-se</h2>
            
            {/* Bloco Dinâmico de Mensagem de Sucesso */}
            {form.sucesso && (
              <div className="alerta-sucesso-global">
                <p>{form.sucesso}</p>
              </div>
            )}
            
            <form onSubmit={acoes.finalizarCadastro} className="form-grid">
              
              <div className="full-width">
                <Input 
                  label="Nome" 
                  value={form.nome} 
                  onChange={(e) => form.setNome(e.target.value)} 
                  readOnly={telaBloqueadaPorSucesso}
                />
                {erros.nome && <span className="error-text">{erros.nome}</span>}
              </div>

              <div className="full-width">
                <Input 
                  label="Email" 
                  type="email" 
                  value={form.e_mail} 
                  onChange={(e) => form.setEmail(e.target.value)} 
                  readOnly={telaBloqueadaPorSucesso}
                />
                {erros.e_mail && <span className="error-text">{erros.e_mail}</span>}
              </div>

              <div className="full-width">
                <Input 
                  label="Telefone" 
                  value={form.telefone} 
                  onChange={(e) => form.setTelefone(e.target.value)} 
                  maxLength={15}
                  readOnly={telaBloqueadaPorSucesso}
                />
                {erros.telefone && <span className="error-text">{erros.telefone}</span>}
              </div>

              <div>
                <Input 
                  label="CPF" 
                  value={form.cpf} 
                  onChange={(e) => form.setCpf(e.target.value)} 
                  maxLength={14}
                  readOnly={telaBloqueadaPorSucesso}
                />
                {erros.cpf && <span className="error-text">{erros.cpf}</span>}
              </div>

              <div>
                <Input 
                  label="Data de nascimento" 
                  type="date" 
                  value={form.dataNascimento} 
                  onChange={(e) => form.setDataNascimento(e.target.value)} 
                  readOnly={telaBloqueadaPorSucesso}
                />
                {erros.dataNascimento && <span className="error-text">{erros.dataNascimento}</span>}
              </div>

              <div>
                <Input 
                  label="Gênero" 
                  placeholder="Masculino/Feminino" 
                  value={form.genero} 
                  onChange={(e) => form.setGenero(e.target.value)} 
                  readOnly={telaBloqueadaPorSucesso}
                />
              </div>

              <div>
                <Input 
                  label="CEP" 
                  value={form.cep} 
                  onChange={(e) => acoes.atualizarCep(e.target.value)} 
                  maxLength={9}
                  readOnly={telaBloqueadaPorSucesso}
                />
                {erros.cep && <span className="error-text">{erros.cep}</span>}
              </div>

              <div className="full-width">
                <Input 
                  label="Bairro" 
                  value={form.bairro} 
                  onChange={(e) => form.setBairro(e.target.value)} 
                  readOnly={deveBloquearCampos}
                />
                {erros.bairro && <span className="error-text">{erros.bairro}</span>}
              </div>

              <div className="full-width">
                <Input 
                  label="Rua" 
                  value={form.rua} 
                  onChange={(e) => form.setRua(e.target.value)} 
                  readOnly={deveBloquearCampos}
                />
                {erros.rua && <span className="error-text">{erros.rua}</span>}
              </div>

              <div>
                <Input 
                  label="Estado" 
                  value={form.estado} 
                  onChange={(e) => form.setEstado(e.target.value)} 
                  readOnly={deveBloquearCampos}
                />
              </div>

              <div>
                <Input 
                  label="Número" 
                  value={form.numero} 
                  onChange={(e) => form.setNumero(e.target.value)} 
                  readOnly={telaBloqueadaPorSucesso}
                />
                {erros.numero && <span className="error-text">{erros.numero}</span>}
              </div>

              <div className="full-width">
                <Input 
                  label="Complemento" 
                  value={form.complemento} 
                  onChange={(e) => form.setComplemento(e.target.value)} 
                  readOnly={telaBloqueadaPorSucesso}
                />
              </div>

              <div className="full-width">
                <Input 
                  label="Senha" 
                  type="password" 
                  value={form.senha} 
                  onChange={(e) => form.setSenha(e.target.value)} 
                  readOnly={telaBloqueadaPorSucesso}
                />
                {erros.senha && <span className="error-text">{erros.senha}</span>}
              </div>

              {erros.geral && (
                <div className="full-width">
                  <p className="error-text" style={{ textAlign: 'center', fontSize: '1rem' }}>
                    {erros.geral}
                  </p>
                </div>
              )}

              <div className="password-requirements full-width">
                <p>A senha deve conter:</p>
                <ul>
                  <li>1 caracter especial: (#@!&%);</li>
                  <li>1 Letra maiúscula;</li>
                  <li>1 Número;</li>
                  <li>Mínimo de 8 caracteres;</li>
                  <li>Máximo de 12 caracteres;</li>
                </ul>
              </div>

              <div className="terms-container full-width" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input 
                    type="checkbox" 
                    id="terms" 
                    checked={form.termosAceitos}
                    disabled={telaBloqueadaPorSucesso}
                    onChange={(e) => form.setTermosAceitos(e.target.checked)}
                    />
                    <label htmlFor="terms">Termos de condição de uso da aplicação</label>
                </div>
                    {erros.termos && <span className="error-text" style={{ marginLeft: 0 }}>{erros.termos}</span>}
                </div>

              <div className="full-width btn-wrapper">
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={form.carregando || telaBloqueadaPorSucesso}
                >
                  {form.carregando ? 'Cadastrando...' : 'Finalizar'}
                </Button>
              </div>
            </form>
          </div>
        </section>

        <section className="image-section"></section>
      </div>
    </Background>
  );
}