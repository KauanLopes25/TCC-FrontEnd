const BASE_URL = "http://localhost:5000/v1/semprelimpa/";

export const buscarLavanderias = async (
    buscaNome: string, 
    filtrosAtivos: string[], 
    bairroSelecionado?: string, 
    cidadeSelecionada?: string
) => {
    const params = new URLSearchParams();

    if (buscaNome !== '') {
        params.append('nome', buscaNome); 
    }
    if (filtrosAtivos.includes('preco')) {
        params.append('preco_max_lavagem', '30');
    }
    if (filtrosAtivos.includes('avaliacao')) {
        params.append('avaliacao_minima', '4');
    }
    
    // 🚀 NOVO: Se o filtro de distância estiver ativo e houver localidade preenchida, repassa para o Knex
    if (filtrosAtivos.includes('distancia') && bairroSelecionado) {
        params.append('bairro', bairroSelecionado);
    }
    if (filtrosAtivos.includes('distancia') && cidadeSelecionada) {
        params.append('cidade', cidadeSelecionada);
    }

    const url = `${BASE_URL}lavanderia/filtro?${params.toString()}`;

    const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.mensagemErro || "Erro ao buscar as lavanderias");
    }

    return data; 
};