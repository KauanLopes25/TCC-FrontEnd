import { useState } from 'react';
import { enviarPedidoCompleto } from '../services/pedidoService';

export function usePedido() {
  const [processandoPagamento, setProcessandoPagamento] = useState(false);
  
  // Estado para armazenar os dados devolvidos pela AbacatePay
  const [dadosPagamentoAbacate, setDadosPagamentoAbacate] = useState<{
    metodo: 'pix' | 'cartao';
    qrCodeTexto?: string;
    qrCodeUrl?: string;
    checkoutUrl?: string; 
  } | null>(null);

  const criarPedido = async (payloadDoBanco: any) => {
    setProcessandoPagamento(true);
    setDadosPagamentoAbacate(null); 

    try {
      // 1. Dispara o JSON para o Node.js
      const resultado = await enviarPedidoCompleto(payloadDoBanco);

      // 2. Extrai os dados do pagamento do padrão de resposta da sua API
      const dadosPagamento = resultado.items?.pagamento;

      if (dadosPagamento) {
        if (payloadDoBanco.tipo_pagamento === 'PIX') {
          setDadosPagamentoAbacate({
            metodo: 'pix',
            qrCodeTexto: dadosPagamento.codigo_copia_cola,
            qrCodeUrl: dadosPagamento.url_imagem_qrcode 
          });
        } 
        else if (payloadDoBanco.tipo_pagamento === 'CARTAO') {
           console.log("Cartão processado! O componente vai mudar a tela agora.");
        }
      }

      return { sucesso: true, dados: resultado };
    } catch (erro: any) {
      console.error("Erro na criação do pedido:", erro);
      return { sucesso: false, erro: erro.message };
    } finally {
      setProcessandoPagamento(false);
    }
  };

  return { criarPedido, processandoPagamento, dadosPagamentoAbacate };
}