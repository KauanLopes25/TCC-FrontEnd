import { useState, useEffect } from 'react';
import { buscarDetalhesPedidoAPI } from '../services/pedidoService';

export const useAcompanhamento = (idPedido: string | undefined) => {
  const [dadosPedido, setDadosPedido] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);
  const [idCestoAtivo, setIdCestoAtivo] = useState<number | null>(null);

  useEffect(() => {
    if (!idPedido) return;

    const carregarDados = async (isFirstLoad = false) => {
      if (isFirstLoad) setLoading(true);
      
      try {
        const data = await buscarDetalhesPedidoAPI(idPedido);
        
        if (data.status_code === 200 && data.items?.Pedido?.length > 0) {
          const linhasDoBanco = data.items.Pedido;
          const cestosMap = new Map();
          
          linhasDoBanco.forEach((linha: any) => {
            if (linha.cesto_id) {
              if (!cestosMap.has(linha.cesto_id)) {
                cestosMap.set(linha.cesto_id, {
                  id: Number(linha.cesto_id),
                  tipo: linha.tipo_lavagem,
                  secagem: linha.secagem,
                  peso: linha.peso_estimado,
                  roupas: []
                });
              }
              if (linha.nome_peca) {
                cestosMap.get(linha.cesto_id).roupas.push({
                  nome: linha.nome_peca,
                  quantidade: linha.quantidade
                });
              }
            }
          });

          const cestosAgrupados = Array.from(cestosMap.values());

          setDadosPedido({
            numero_pedido: linhasDoBanco[0].pedido_id,
            valor_total: Number(linhasDoBanco[0].valor_total),
            status: linhasDoBanco[0].status_pedido, // Captura a string da View (ex: 'SOLICITADO')
            lavanderia: linhasDoBanco[0].lavanderia,
            motorista: linhasDoBanco[0].motorista, 
            cestos: cestosAgrupados
          });
          
          if (isFirstLoad && cestosAgrupados.length > 0) {
            setIdCestoAtivo(cestosAgrupados[0].id);
          }
          setErro(null);
        } else {
          setErro("Pedido não encontrado.");
        }
      } catch (err: any) {
        if (isFirstLoad) setErro(err.message || "Erro de conexão.");
      } finally {
        if (isFirstLoad) setLoading(false);
      }
    };

    // Primeira execução imediata
    carregarDados(true);

    // Atualiza os dados a cada 5 segundos em segundo plano
    const intervalo = setInterval(() => {
      carregarDados(false);
    }, 5000);

    return () => clearInterval(intervalo);
  }, [idPedido]);

  return { dadosPedido, loading, erro, idCestoAtivo, setIdCestoAtivo };
};