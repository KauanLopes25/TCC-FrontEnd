// Ajuste a BASE_URL se estiver em outro arquivo de configuração
const BASE_URL = 'http://localhost:5000/v1/semprelimpa'; 

export const buscarCatalogoRoupas = async () => {
  try {
    const response = await fetch(`${BASE_URL}/roupa`);
    
    // Tratamento de erro nativo do HTTP (400, 404, 500, etc.)
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const resultado = await response.json();
    
    // Validação do padrão de envelopamento do seu backend
    if (resultado.status_code === 200) {
      // Retorna o objeto completo para que o Hook decida se extrai de .items, .dados, etc.
      return resultado; 
    } else {
      throw new Error(resultado.message || 'Erro ao buscar o catálogo de roupas.');
    }

  } catch (error) {
    console.error('Erro no roupaService:', error);
    throw error;
  }
};