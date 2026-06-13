// Ajuste a BASE_URL ou importe a sua instância do Axios caso use
const BASE_URL = 'http://localhost:5000/v1/semprelimpa'; 

export const buscarPedidosDoUsuario = async (usuario_id: number) => {
  try {
    const response = await fetch(`${BASE_URL}/pedidousuario/${usuario_id}`);
    
    // Se o Express devolver um erro 400 ou 500
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const resultado = await response.json();
    
    // Como combinamos antes, o seu backend devolve tudo dentro de um objeto padrão
    // que geralmente tem "status_code" e os dados dentro de "items".
    if (resultado.status_code === 200) {
      return resultado; 
    } else {
      throw new Error(resultado.message || 'Erro ao buscar pedidos.');
    }

  } catch (error) {
    console.error('Erro no pedidoService:', error);
    throw error;
  }
};



export const enviarPedidoCompleto = async (payloadDoBanco: any) => {
  // O fetch aponta para a rota exata que ajustamos no Express
  const response = await fetch(`${BASE_URL}/pedido-completo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payloadDoBanco)
  });
  console.log(response.body)
  console.log(payloadDoBanco)
  const resultado = await response.json();

  // Verifica o status code do seu padrão de MESSAGES (201 é o sucesso de criação)
  if (resultado.status_code !== 201) {
    throw new Error(resultado.message || 'Falha ao processar o pedido no servidor.');
  }

  return resultado; 
};

// 🚀 NOVA FUNÇÃO ADICIONADA AQUI:
export const buscarDetalhesPedidoAPI = async (idPedido: string) => {
  try {
    const response = await fetch(`${BASE_URL}/pedidodetalhes/${idPedido}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Erro ao buscar os detalhes do pedido.");
    }

    return data;
  } catch (error) {
    console.error('Erro ao buscar detalhes do pedido:', error);
    throw error;
  }
};