const BASE_URL = "http://localhost:5000/v1/semprelimpa/";

export const salvarCartaoNaApi = async (dadosCartao: any) => {
  // Montamos o pacote exatamente como o back-end espera
  const payload = {
    usuario_id: 1, // Fixo como 1 para o MVP do TCC
    numero: dadosCartao.numero,
    validade: dadosCartao.validade,
    cvv: dadosCartao.cvv,
    nome: dadosCartao.nome,
    cpf: dadosCartao.cpf
  };

  const response = await fetch(`${BASE_URL}cartao`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok || !data.status) {
    throw new Error(data.message || "Erro ao registrar o cartão");
  }

  // Devolvemos o cartão que o back-end mastigou e retornou no "items"
  return data.items; 
};