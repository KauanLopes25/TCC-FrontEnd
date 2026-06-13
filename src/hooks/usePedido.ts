import { useState } from 'react';
import { enviarPedidoCompleto } from '../services/pedidoService';

export function usePedido() {
  const [processandoPagamento, setProcessandoPagamento] = useState(false);
  
  const [dadosPagamentoAbacate, setDadosPagamentoAbacate] = useState<{
    metodo: 'pix' | 'cartao';
    qrCodeTexto?: string;
    qrCodeUrl?: string;
    checkoutUrl?: string; 
    idPedidoBanco?: number; // 🚀 Adicionamos o ID aqui para o botão do PIX usar
  } | null>(null);

  const criarPedido = async (payloadDoBanco: any) => {
    setProcessandoPagamento(true);
    setDadosPagamentoAbacate(null); 

    try {
      const resultado = await enviarPedidoCompleto(payloadDoBanco);
      const dadosPagamento = resultado.items?.pagamento;

      if (dadosPagamento) {
        if (payloadDoBanco.tipo_pagamento === 'PIX') {
          setDadosPagamentoAbacate({
            metodo: 'pix',
            qrCodeTexto: dadosPagamento.codigo_copia_cola,
            qrCodeUrl: dadosPagamento.url_imagem_qrcode,
            idPedidoBanco: resultado.items?.pedido_id // 🚀 Salvamos o ID gerado pelo banco!
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