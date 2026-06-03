import { useState } from 'react';
// Importe suas funções do authService que você já tem prontas
import { esquecerSenha, resetarSenha } from '../services/tokenService'; 
import { validarEmail, validarSenha } from '../utils/validacoes'; // Assumindo que você tem isso


export function useRecuperacaoSenha(aoFinalizarSucesso: () => void) {
  // Controle de fluxo da tela (1 = Pede Email | 2 = Pede Token e Nova Senha)
  const [etapa, setEtapa] = useState<1 | 2>(1);
  
  // Campos do formulário
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  
  // Estados de feedback
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  // PASSO 1: Disparar o E-mail
  const enviarCodigo = async () => {
    setMensagemErro(null);
    setMensagemSucesso(null);

    if (!validarEmail(email)) {
      setMensagemErro('Por favor, insira um e-mail válido.');
      return;
    }

    try {
      setCarregando(true);
      await esquecerSenha(email);
      setMensagemSucesso('Código enviado! Verifique sua caixa de entrada.');
      setEtapa(2); // Muda a tela para o passo 2
    } catch (error: any) {
      setMensagemErro(error.message || 'Erro ao solicitar recuperação.');
    } finally {
      setCarregando(false);
    }
  };

  // PASSO 2: Validar Token e Trocar Senha
  const confirmarNovaSenha = async () => {
    setMensagemErro(null);
    
    if (token.length < 0) {
      setMensagemErro('Preencha o código corretamente.');
      return;
    }
    if(!validarSenha(novaSenha)){
      setMensagemErro('a nova senha não atende aos requisitos (minimo de 8 caracteres, 1 letra Maiuscula, 1 caracter especial, máximo de 12 caracteres)')
      return
    }

    try {
      setCarregando(true);
      await resetarSenha(token, novaSenha);
      setMensagemSucesso('Senha alterada com sucesso!');
      
      // Aguarda 2 segundos para o usuário ler o sucesso e joga pro Login
      setTimeout(() => {
        aoFinalizarSucesso(); 
      }, 2000);
      
    } catch (error: any) {
      setMensagemErro(error.message || 'Código inválido ou expirado.');
    } finally {
      setCarregando(false);
    }
  };

  return {
    estado: { etapa, email, token, novaSenha, mensagemErro, mensagemSucesso, carregando },
    setters: { setEmail, setToken, setNovaSenha, setEtapa },
    acoes: { enviarCodigo, confirmarNovaSenha }
  };
}