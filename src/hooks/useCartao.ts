import { useState } from 'react';
import { salvarCartaoNaApi } from '../services/cartaoService';

export function useCartao() {
  const [salvandoCartao, setSalvandoCartao] = useState(false);

  const registrarCartao = async (dadosCartao: any) => {
    setSalvandoCartao(true);
    try {
      // Chama a service
      const novoCartaoSalvo = await salvarCartaoNaApi(dadosCartao);
      return novoCartaoSalvo; // Retorna para o componente usar
    } catch (error: any) {
        console.log(error)
      console.error("Falha no hook de cartão:", error.message);
      alert("Erro ao salvar cartão: " + error.message);
      return null;
    } finally {
      setSalvandoCartao(false);
    }
  };

  return { registrarCartao, salvandoCartao };
}