import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Hook de navegação adicionado
import { buscarCepViaCep } from "../services/viaCepService"; 
import { realizarCadastro } from "../services/authService";
import { 
  apenasNumeros, 
  formatarDataParaBanco, 
  validarCep, 
  validarCpf, 
  validarEmail, 
  validarMaiorIdade, 
  validarSenha, 
  validarTelefone,
  formatarCPF, 
  formatarTelefone, 
  formatarCEP 
} from "../utils/validacoes"; 
import { mensagensDeERRO } from "../utils/erros";

export function useCadastro() {
  const navigate = useNavigate(); // Inicializando a navegação

  const [erros, setErros] = useState<Record<string, string | null>>({});
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);
  
  // Novos estados para controle de UX
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const [termosAceitos, setTermosAceitos] = useState(false);
  const [nome, setNome] = useState("");
  const [e_mail, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [cpf, setCpf] = useState("");
  const [genero, setGenero] = useState("");

  const [cep, setCep] = useState("");
  const [bairro, setBairro] = useState("");
  const [rua, setRua] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [complemento, setComplemento] = useState("");
  const [numero, setNumero] = useState("");
  const [buscarCep, setBuscarCep] = useState(false);

  const [senha, setSenha] = useState("");

  const limparErro = (campo: string) => {
    setErros((prev) => ({ ...prev, [campo]: null }));
  };

  const handleCpfChange = (valor: string) => setCpf(formatarCPF(valor));
  const handleTelefoneChange = (valor: string) => setTelefone(formatarTelefone(valor));

  const atualizarCep = async (cepDigitado: string) => {
    const cepFormatado = formatarCEP(cepDigitado);
    setCep(cepFormatado);
    limparErro('cep');

    const cepApenasNumeros = apenasNumeros(cepFormatado);

    if (cepApenasNumeros.length === 8) {
      setBuscarCep(true);
      setMensagemErro(null);

      const endereco = await buscarCepViaCep(cepApenasNumeros);

      if (endereco) {
        setRua(endereco.logradouro);
        setBairro(endereco.bairro);
        setCidade(endereco.localidade);
        setEstado(endereco.uf);

        setErros((prev) => ({ ...prev, rua: null, bairro: null, cidade: null, estado: null }));
      } else {
        setErros((prev) => ({ ...prev, cep: mensagensDeERRO.preencherCampo.cep }));
      }

      setBuscarCep(false);
    }
  };

  const finalizarCadastro = async (e?: React.FormEvent) => {
    if (e) e.preventDefault(); 
    if (sucesso) return false; // Trava para impedir duplo clique

    let novosErros: Record<string, string> = {};

    if (nome.trim().length < 3 || nome.trim().length > 100) novosErros.nome = mensagensDeERRO.preencherCampo.nome;
    if (!validarEmail(e_mail)) novosErros.e_mail = mensagensDeERRO.validacao.emailInvalido;
    if (!validarCpf(cpf)) novosErros.cpf = mensagensDeERRO.validacao.cpfInvalido;
    if (!validarTelefone(telefone)) novosErros.telefone = mensagensDeERRO.preencherCampo.telefone;
    if (!validarMaiorIdade(dataNascimento)) novosErros.dataNascimento = mensagensDeERRO.preencherCampo.idade;
    if (!validarCep(cep)) novosErros.cep = mensagensDeERRO.preencherCampo.cep;
    if (rua.trim() === '') novosErros.rua = mensagensDeERRO.preencherCampo.rua;
    if (numero.trim() === '') novosErros.numero = mensagensDeERRO.preencherCampo.numero;
    if (bairro.trim() === '') novosErros.bairro = mensagensDeERRO.preencherCampo.bairro;
    if (!validarSenha(senha)) novosErros.senha = mensagensDeERRO.validacao.senhaFraca;
    if (!termosAceitos) novosErros.termos = "Você precisa aceitar os termos de uso";
    
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return false;
    }

    setErros({});
    setCarregando(true); // Ativa o loading visual na tela

    const payloadParaAPI = {
      nome,
      e_mail,
      telefone: apenasNumeros(telefone),
      cpf: apenasNumeros(cpf),
      data_nascimento: formatarDataParaBanco(dataNascimento),
      endereco: {
        cep: apenasNumeros(cep),
        logradouro: rua,
        numero,
        complemento,
        bairro,
        cidade,
        uf: estado
      },
      senha,
    };

    try {
      await realizarCadastro(payloadParaAPI);
      
      // Se a API responder bem, ativamos a mensagem de sucesso
      setSucesso("Cadastro realizado com sucesso! Redirecionando para o login...");
      
      // Segura 2.5 segundos na tela para o usuário ler, e depois manda pro login
      setTimeout(() => {
        navigate("/login"); 
      }, 2500);

      return true;
    } catch (error: any) {
      setErros(prev => ({ ...prev, geral: error.message }));
      return false;
    } finally {
      setCarregando(false); // Desativa o loading se der erro (se der sucesso, a tela vai mudar de qualquer forma)
    }
  };

  return {
    form: {
      mensagemErro, nome, e_mail, telefone, cpf, dataNascimento, genero,
      setNome, setEmail, 
      setTelefone: handleTelefoneChange, 
      setCpf: handleCpfChange, 
      setDataNascimento, setGenero, 
      cep, rua, numero, complemento, bairro, cidade, estado, buscarCep,
      setCep, setRua, setNumero, setComplemento, setBairro, setCidade, setEstado,
      senha, setSenha, termosAceitos, setTermosAceitos,
      
      // Exportando os estados de UX para a tela usar
      sucesso,
      carregando
    },
    acoes: { finalizarCadastro, atualizarCep, limparErro },
    erros
  };
}