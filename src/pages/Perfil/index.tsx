import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiArrowLeft, FiPencil, FiLogOut, FiCheck, 
  FiUser, FiMapPin, FiMail, FiPhone, FiCreditCard, FiCalendar 
} from 'react-icons/fi';

// Suas importações de serviços e validações já existentes (Ajuste os caminhos se necessário)
import { buscarCepViaCep } from '../../services/viaCepService';
// import { atualizarPerfilUsuario, atualizarEndereco } from '../services/authService';
// import { 
//   validarEmail, 
//   validarMaiorIdade, 
//   validarTelefone 
// } from '../utils/validacoes';

export function Perfil() {
  const navigate = useNavigate();
  const [modoEdicao, setModoEdicao] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');

  // Mock provisório do hook usePerfil para a interface compilar perfeitamente
  // Quando plugar o seu hook real, basta remover esse objeto
  const form = {
    usuario: {
      nome: "Guilherme Viana de Souza",
      email: "guilherme@email.com",
      telefone: "11999999999",
      cpf: "123.456.789-00",
      dataNascimento: "03032008", // Exemplo string contínua DDMMAAAA
      cep: "06600000",
      rua: "Avenida Principal",
      bairro: "Centro",
      cidade: "Jandira",
      estado: "SP",
      complemento: "Bloco B Apt 42",
      numero: "1500",
      idEndereco: 1
    }
  };

  // Estados do Formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');

  const [rua, setRua] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [cep, setCep] = useState('');
  const [complemento, setComplemento] = useState('');
  const [numero, setNumero] = useState('');

  // Carrega os dados iniciais do usuário no formulário
  useEffect(() => {
    if (form.usuario) {
      resetarCampos();
    }
  }, [form.usuario]);

  const resetarCampos = () => {
    setNome(form.usuario.nome);
    setEmail(form.usuario.email);
    setTelefone(form.usuario.telefone);
    setDataNascimento(form.usuario.dataNascimento);
    setRua(form.usuario.rua);
    setBairro(form.usuario.bairro);
    setCidade(form.usuario.cidade);
    setEstado(form.usuario.estado);
    setCep(form.usuario.cep);
    setComplemento(form.usuario.complemento);
    setNumero(form.usuario.numero);
  };

  // Integração com o ViaCep idêntica ao Mobile
  const lidarComMudancaCep = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorDigitado = e.target.value;
    const cepLimpo = valorDigitado.replace(/\D/g, '');
    
    setCep(cepLimpo.slice(0, 8));

    if (cepLimpo.length !== 8) return;

    try {
      const endereco: any = await buscarCepViaCep(cepLimpo);
      setRua(endereco.logradouro || '');
      setBairro(endereco.bairro || '');
      setCidade(endereco.localidade || '');
      setEstado(endereco.uf || '');
      setMensagemErro('');
    } catch (error) {
      setRua('');
      setBairro('');
      setCidade('');
      setEstado('');
      setMensagemErro('CEP não encontrado');
    }
  };

  // Salvamento e Validações integradas do TCC
  const salvarAlteracoes = async () => {
    setMensagemErro("");

    if (!validarEmail(email)) {
      setMensagemErro("E-mail inválido");
      return;
    }
    if (!validarTelefone(telefone)) {
      setMensagemErro("Telefone inválido");
      return;
    }
    if (!validarMaiorIdade(dataNascimento)) {
      setMensagemErro("É necessário ser maior de idade");
      return;
    }

    try {
      // Formatação da data para o padrão do banco (YYYY-MM-DD)
      let dataFormatada = dataNascimento;
      if (dataNascimento.length === 8 && !dataNascimento.includes('/')) {
        const dia = dataNascimento.slice(0, 2);
        const mes = dataNascimento.slice(2, 4);
        const ano = dataNascimento.slice(4, 8);
        dataFormatada = `${ano}-${mes}-${dia}`;
      }

      // 1. Atualiza dados principais do usuário
      await atualizarPerfilUsuario({
        nome,
        e_mail: email,
        telefone,
        cpf: form.usuario.cpf,
        data_nascimento: dataFormatada
      });

      // 2. Atualiza endereço associado
      await atualizarEndereco(form.usuario.idEndereco, {
        cep,
        logradouro: rua,
        bairro,
        uf: estado,
        cidade,
        complemento,
        numero
      });

      setModoEdicao(false);
    } catch (error: any) {
      setMensagemErro(error.message || "Erro ao atualizar o perfil");
      console.error(error);
    }
  };

  const lidarComLogout = async () => {
    try {
      // localStorage.clear(); ou sua função importada de logout
      localStorage.removeItem('@SempreLimpa:token');
      navigate('/login');
    } catch (error) {
      console.error("Erro ao efetuar logout", error);
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      
      {/* HEADER DA TELA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#64748b', gap: '8px', fontWeight: 'bold' }}
        >
          <FiArrowLeft size={22} /> Voltar
        </button>
        <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.6rem' }}>Meu Perfil</h2>
        
        <button 
          onClick={() => {
            if (modoEdicao) resetarCampos();
            setModoEdicao(!modoEdicao);
          }}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px',
            backgroundColor: modoEdicao ? '#ef4444' : '#f1f5f9',
            color: modoEdicao ? '#fff' : '#475569',
            border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
          }}
        >
          <FiPencil size={18} /> {modoEdicao ? 'Cancelar' : 'Editar Perfil'}
        </button>
      </div>

      {/* GRADE LAYOUT PRINCIPAL (2 COLUNAS) */}
      <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
        
        {/* COLUNA ESQUERDA: Card Resumo Perfil */}
        <div style={{ flex: 1, backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ width: '130px', height: '130px', borderRadius: '50%', border: '4px solid #0056b3', overflow: 'hidden', marginBottom: '20px', backgroundColor: '#f1f5f9', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <FiUser size={60} color="#94a3b8" />
          </div>
          
          <h3 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '1.4rem' }}>{modoEdicao ? nome : form.usuario.nome}</h3>
          <p style={{ margin: '0 0 24px 0', color: '#64748b', fontSize: '0.95rem' }}>Cliente SempreLimpa</p>
          
          <div style={{ width: '100%', height: '1px', backgroundColor: '#e2e8f0', marginBottom: '24px' }}></div>
          
          <button 
            onClick={lidarComLogout}
            style={{ width: '100%', padding: '12px', backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: 'background 0.2s' }}
          >
            <FiLogOut size={18} /> Sair da Conta
          </button>
        </div>

        {/* COLUNA DIREITA: Formulários de Dados e Endereço */}
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Card: Dados Pessoais */}
          <div style={styles.cardFormulario}>
            <h3 style={styles.tituloSecao}><FiUser /> Dados Pessoais</h3>
            
            <div style={styles.gridCampos}>
              <div style={styles.campoGrupo}>
                <label style={styles.labelForm}><FiMail style={{marginRight: '4px'}}/> E-mail</label>
                <input 
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  disabled={!modoEdicao} style={modoEdicao ? styles.inputWebAtivo : styles.inputWebDesativado}
                />
              </div>

              <div style={styles.campoGrupo}>
                <label style={styles.labelForm}><FiPhone style={{marginRight: '4px'}}/> Telefone Celular</label>
                <input 
                  type="text" value={telefone} maxLength={11}
                  onChange={(e) => setTelefone(e.target.value.replace(/\D/g, ''))}
                  disabled={!modoEdicao} style={modoEdicao ? styles.inputWebAtivo : styles.inputWebDesativado}
                />
              </div>

              <div style={styles.campoGrupo}>
                <label style={styles.labelForm}><FiCreditCard style={{marginRight: '4px'}}/> CPF (Inalterável)</label>
                <input 
                  type="text" value={form.usuario.cpf} disabled 
                  style={styles.inputWebDesativado}
                />
              </div>

              <div style={styles.campoGrupo}>
                <label style={styles.labelForm}><FiCalendar style={{marginRight: '4px'}}/> Data de Nascimento</label>
                <input 
                  type="text" value={dataNascimento} maxLength={8} placeholder="DDMMAAAA"
                  onChange={(e) => setDataNascimento(e.target.value.replace(/\D/g, ''))}
                  disabled={!modoEdicao} style={modoEdicao ? styles.inputWebAtivo : styles.inputWebDesativado}
                />
              </div>
            </div>
          </div>

          {/* Card: Endereço Residencia */}
          <div style={styles.cardFormulario}>
            <h3 style={styles.tituloSecao}><FiMapPin /> Endereço de Entrega</h3>
            
            <div style={styles.gridCampos}>
              <div style={styles.campoGrupo}>
                <label style={styles.labelForm}>CEP</label>
                <input 
                  type="text" value={cep} maxLength={8} placeholder="Digite o CEP"
                  onChange={lidarComMudancaCep}
                  disabled={!modoEdicao} style={modoEdicao ? styles.inputWebAtivo : styles.inputWebDesativado}
                />
              </div>

              <div style={styles.campoGrupo}>
                <label style={styles.labelForm}>Logradouro / Rua</label>
                <input type="text" value={rua} disabled style={styles.inputWebDesativatedAddress} />
              </div>

              <div style={styles.campoGrupo}>
                <label style={styles.labelForm}>Bairro</label>
                <input type="text" value={bairro} disabled style={styles.inputWebDesativatedAddress} />
              </div>

              <div style={styles.campoGrupo}>
                <label style={styles.labelForm}>Cidade / UF</label>
                <input type="text" value={`${cidade} - ${estado}`} disabled style={styles.inputWebDesativatedAddress} />
              </div>

              <div style={styles.campoGrupo}>
                <label style={styles.labelForm}>Número</label>
                <input 
                  type="text" value={numero} placeholder="Nº" maxLength={6}
                  onChange={(e) => setNumero(e.target.value.replace(/\D/g, ''))}
                  disabled={!modoEdicao} style={modoEdicao ? styles.inputWebAtivo : styles.inputWebDesativado}
                />
              </div>

              <div style={styles.campoGrupo}>
                <label style={styles.labelForm}>Complemento</label>
                <input 
                  type="text" value={complemento} placeholder="Apt, Bloco, etc."
                  onChange={(e) => setComplemento(e.target.value)}
                  disabled={!modoEdicao} style={modoEdicao ? styles.inputWebAtivo : styles.inputWebDesativado}
                />
              </div>
            </div>
          </div>

          {/* ÁREA DE FEEDBACK DE ERRO E SALVAMENTO */}
          {modoEdicao && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px', marginTop: '8px' }}>
              {mensagemErro && (
                <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '0.95rem' }}>
                  ⚠️ {mensagemErro}
                </span>
              )}
              <button 
                onClick={salvarAlteracoes}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 28px', backgroundColor: '#22c55e', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.05rem', boxShadow: '0 4px 12px rgba(34,197,94,0.2)' }}
              >
                <FiCheck size={20} /> Salvar Alterações
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// Estilos JS limpos e otimizados para Desktop
const styles = {
  cardFormulario: {
    backgroundColor: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.01)'
  },
  tituloSecao: {
    margin: '0 0 20px 0',
    color: '#1e293b',
    fontSize: '1.2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    borderBottom: '1px solid #f1f5f9',
    paddingBottom: '12px'
  },
  gridCampos: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  },
  campoGrupo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px'
  },
  labelForm: {
    fontSize: '0.85rem',
    color: '#64748b',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center'
  },
  inputWebAtivo: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #0056b3',
    backgroundColor: '#fff',
    color: '#0f172a',
    fontSize: '1rem',
    outline: 'none',
    boxShadow: '0 0 0 3px rgba(0,86,179,0.1)'
  },
  inputWebDesativado: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    color: '#64748b',
    fontSize: '1rem',
    cursor: 'not-allowed'
  },
  inputWebDesativatedAddress: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#f1f5f9',
    color: '#94a3b8',
    fontSize: '1rem',
    cursor: 'not-allowed'
  }
};