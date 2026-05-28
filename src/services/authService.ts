// src/services/authService.ts
const BASE_URL = "http://localhost:5000/v1/SempreLimpa/";

export const realizarLogin = async (identificacaoPuro: string, senha: string, metodoEscolhido: string) => {
    const endpoint = metodoEscolhido === 'e_mail' ? "Loginemail" : "Logincpf";
    const payload = metodoEscolhido === 'e_mail' 
        ? { email: identificacaoPuro, senha } 
        : { cpf: identificacaoPuro, senha };
    
    const url = `${BASE_URL}${endpoint}`;

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.mensagemErro || "Erro ao fazer login");
    }
    return data;
};

export const realizarCadastro = async (payloadParaAPI: any) => {
    const url = `${BASE_URL}usuario`;

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadParaAPI)
    });

    const data = await response.json();

    if(!response.ok) {
        throw new Error(data.mensagemErro || "Erro ao fazer cadastro");
    }
    return data;
};