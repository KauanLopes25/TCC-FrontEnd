export interface ViaCepResponse {
    cep: string
    logradouro: string
    complemento: string
    bairro: string
    localidade: string
    uf: string
    erro?: boolean
}

export const buscarCepViaCep = async (cep: string): Promise<ViaCepResponse | null> => {
    try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`)

        const dados = await resposta.json()

        if (dados.erro) {
            return null
        }

        return dados as ViaCepResponse
    } catch (error) {
        console.log("Erro na requisição do ViaCEP: ", error)
        return null
    }
}