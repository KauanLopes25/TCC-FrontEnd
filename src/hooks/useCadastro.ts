import { useState } from "react";
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
  const [erros, setErros] = useState<Record<string, string | null>>({});
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);
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
      return true;
    } catch (error: any) {
      setErros(prev => ({ ...prev, geral: error.message }));
      return false;
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
      senha, setSenha, termosAceitos, setTermosAceitos
    },
    acoes: { finalizarCadastro, atualizarCep, limparErro },
    erros
  };
}