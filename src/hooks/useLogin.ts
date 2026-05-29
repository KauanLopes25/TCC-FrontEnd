import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { realizarLogin } from "../services/authService";
import { apenasNumeros, validarEmail, validarCpf } from "../utils/validacoes";

export function useLogin() {
  const navigate = useNavigate();
  const [identificacao, setIdentificacao] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    try {
      // Identifica se o usuário digitou e-mail ou CPF
      let metodo = "";
      let valorPuro = identificacao;

      if (identificacao == ""){
        throw new Error("Campo não pode está vazio")
      }
      if (identificacao.includes("@")) {
        if (!validarEmail(identificacao)) throw new Error("E-mail inválido");
        metodo = "e_mail";
      } else {
        valorPuro = apenasNumeros(identificacao);
        if (!validarCpf(valorPuro)) throw new Error("CPF inválido");
        metodo = "cpf";
      }

      const resposta = await realizarLogin(valorPuro, senha, metodo);
      navigate("/home"); 

    } catch (err: any) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  };

  return {
    identificacao, setIdentificacao,
    senha, setSenha,
    handleLogin,
    erro,
    carregando
  };
}