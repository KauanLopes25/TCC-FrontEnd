import { jwtDecode } from 'jwt-decode';

const BASE_URL = "http://localhost:5000/v1/semprelimpa";
const TOKEN_KEY = 'usuario_logado_token';

interface JwtPayload {
  usuario_id: number;
  email: string;
  exp: number;
}

// ==========================================
//    REQUISIÇÕES DE RECUPERAÇÃO DE SENHA
// ==========================================

export async function esquecerSenha(email: string) {
  const response = await fetch(`${BASE_URL}/esquecisenha`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Erro ao solicitar recuperação de senha.');
  }

  return data;
}

export async function resetarSenha(token: string, novaSenha: string) {
  const response = await fetch(`${BASE_URL}/resetarsenha`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token, novaSenha }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Erro ao resetar senha.');
  }

  return data;
}

// ==========================================
//    GERENCIAMENTO DE TOKEN (VERSÃO WEB)
// ==========================================

export const salvarToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    console.log("TOKEN GRAVADO COM SUCESSO NO NAVEGADOR!");
  } catch (error) {
    console.error("Erro ao salvar o token:", error);
  }
};

export const obterTokenSalvo = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error("Erro ao obter token:", error);
    return null;
  }
};

export const verificarSeEstaLogado = (): boolean => {
  try {
    const token = obterTokenSalvo();
    if (!token) return false;

    const decoded = jwtDecode<JwtPayload>(token);
    const tempoAtual = Date.now() / 1000;

    if (decoded.exp < tempoAtual) {
      console.warn("Sessão expirada.");
      efetuarLogout();
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};

export const efetuarLogout = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error("Erro ao efetuar logout:", error);
  }
};