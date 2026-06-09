import { useState } from 'react';

export interface CestoData {
  id: number;
  itens: Record<number, number>; // Mapeia id_roupa -> quantidade inserida
  limiteMaximo: number; // Ex: 30 peças
}

export function useCesto() {
  // Inicializa o app com 1 cesto ativo com limite de 30 peças
  const [cestos, setCestos] = useState<CestoData[]>([
    { id: 1, itens: {}, limiteMaximo: 30 }
  ]);
  const [idCestoAtivo, setIdCestoAtivo] = useState<number>(1);

  const adicionarCesto = () => {
    const novoId = cestos.length + 1;
    setCestos([...cestos, { id: novoId, itens: {}, limiteMaximo: 30 }]);
    setIdCestoAtivo(novoId); // Já foca automaticamente no cesto novo
  };

  const selecionarCesto = (id: number) => {
    setIdCestoAtivo(id);
  };

  // Calcula dinamicamente quantas peças existem dentro de um cesto específico
  const calcularTotalPecas = (cesto: CestoData) => {
    return Object.values(cesto.itens).reduce((acc, qtd) => acc + qtd, 0);
  };

  const alterarQuantidadeRoupa = (roupaId: number, operacao: 'somar' | 'subtrair') => {
    setCestos((prevCestos) =>
      prevCestos.map((cesto) => {
        if (cesto.id !== idCestoAtivo) return cesto;

        const quantidadeAtual = cesto.itens[roupaId] || 0;
        const totalPecasNoCesto = calcularTotalPecas(cesto);

        if (operacao === 'somar') {
          // Trava de segurança se atingir o limite do cesto (ex: 30 peças)
          if (totalPecasNoCesto >= cesto.limiteMaximo) return cesto;
          return {
            ...cesto,
            itens: { ...cesto.itens, [roupaId]: quantidadeAtual + 1 }
          };
        } else {
          if (quantidadeAtual <= 0) return cesto;
          return {
            ...cesto,
            itens: { ...cesto.itens, [roupaId]: quantidadeAtual - 1 }
          };
        }
      })
    );
  };

  const cestoAtivo = cestos.find((c) => c.id === idCestoAtivo)!;
  const totalPecasAtivas = calcularTotalPecas(cestoAtivo);

  return {
    cestos,
    idCestoAtivo,
    cestoAtivo,
    totalPecasAtivas,
    adicionarCesto,
    selecionarCesto,
    alterarQuantidadeRoupa,
    calcularTotalPecas
  };
}