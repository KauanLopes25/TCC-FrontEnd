import { useState, useEffect } from 'react';
import { buscarPedidosDoUsuario } from '../services/pedidoService';

export const useHome = (idUsuario: number) => {
  const [dadosHome, setDadosHome] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!idUsuario) return;

    const carregarHome = async (isFirstLoad = false) => {
      if (isFirstLoad) setCarregando(true);
      
      try {
        const resultado = await buscarPedidosDoUsuario(idUsuario);
        
        if (resultado.status_code === 200 && resultado.items?.Pedido) {
          const todosPedidos = [...resultado.items.Pedido].sort((a: any, b: any) => 
            Number(b.pedido_id) - Number(a.pedido_id)
          );
          
          // ==========================================
          // 🚀 COLOQUE OS CONSOLES EXATAMENTE AQUI
          // ==========================================
          console.log("📦 Array completo de pedidos que chegou do banco:", todosPedidos);
          
          if (todosPedidos.length > 0) {
            console.log("🔍 Chaves do objeto (como as colunas se chamam):", Object.keys(todosPedidos[0]));
            console.log("🔢 Valor de quantidade_cestos:", todosPedidos[0].quantidade_cestos);
          }
          // ==========================================


          
          const totalPedidos = todosPedidos.length;
          const totalCestos = todosPedidos.reduce((acc: number, p: any) => acc + (Number(p.quantidade_cestos) || 0), 0);

          const obterStatusNormalizado = (p: any) => {
            let status = p.status_pedido || p.progresso;
            let statusId = p.fk_status_id || p.fk_status_pedido_id;

            if (!status && statusId) {
              switch (Number(statusId)) {
                case 1: status = 'SOLICITADO'; break;
                case 2: status = 'ATRIBUIDO'; break;
                case 3: status = 'COLETANDO'; break;
                case 4: status = 'EM_TRANSITO'; break;
                case 5: status = 'LAVANDO'; break;
                case 6: status = 'SECANDO'; break;
                case 7: status = 'RETORNANDO'; break;
                case 8: status = 'ENTREGUE'; break;
                case 9: status = 'CANCELADO'; break;
              }
            }
            return String(status || '').toUpperCase();
          };

          // CORREÇÃO AQUI: O 'ENTREGUE' foi removido desta lista. 
          // Assim que o banco atualizar para Entregue, o painel do topo esvazia.
          const statusAndamento = ['SOLICITADO', 'ATRIBUIDO', 'COLETANDO', 'EM_TRANSITO', 'LAVANDO', 'SECANDO', 'RETORNANDO'];
          
          let pedidoAtual = todosPedidos.find((p: any) => 
            statusAndamento.includes(obterStatusNormalizado(p))
          );

          if (pedidoAtual) {
             const statusStr = obterStatusNormalizado(pedidoAtual);
             let progresso = 10;
             let mensagem = "";
             let statusExibicao = "";
             
             switch(statusStr) {
                case 'SOLICITADO': 
                  progresso = 10; 
                  mensagem = "Aguardando motorista"; 
                  statusExibicao = "Solicitado";
                  break;
                case 'ATRIBUIDO': 
                  progresso = 20; 
                  mensagem = "Motorista aceitou"; 
                  statusExibicao = "Atribuído";
                  break;
                case 'COLETANDO': 
                  progresso = 30; 
                  mensagem = "Indo buscar"; 
                  statusExibicao = "Coletando";
                  break;
                case 'EM_TRANSITO': 
                  progresso = 40; 
                  mensagem = "Indo para lavanderia"; 
                  statusExibicao = "Em Trânsito";
                  break;
                case 'LAVANDO': 
                case 'SECANDO': 
                  progresso = 65; 
                  mensagem = "Processamento"; 
                  statusExibicao = "Em Processamento";
                  break;
                case 'RETORNANDO': 
                  progresso = 90; 
                  mensagem = "Voltando"; 
                  statusExibicao = "Retornando";
                  break;
                // Mantemos por segurança, mas ele não vai ser chamado no topo
                case 'ENTREGUE':
                  progresso = 100; 
                  mensagem = "Pedido entregue! Faça o próximo!"; 
                  statusExibicao = "Entregue";
                  break;
             }
             
             pedidoAtual = { 
               ...pedidoAtual, 
               status_pedido: statusExibicao, 
               progresso, 
               mensagem, 
               tempo_estimado_minutos: 45 
             };
          }

          const ultimosPedidos = todosPedidos
            .filter((p: any) => p.pedido_id !== pedidoAtual?.pedido_id)
            .slice(0, 3)
            .map((p: any) => ({
              ...p,
              status_pedido: obterStatusNormalizado(p) 
            }));

          setDadosHome({
            usuario: { nome: todosPedidos[0]?.nome_usuario || "O Protetor do Amanhã" },
            metricas: { totalPedidos, totalCestos },
            pedidoAtual,
            ultimosPedidos
          });
          setErro(null);
        } else {
           setErro("Nenhum dado encontrado.");
        }
      } catch (error: any) {
        if (isFirstLoad) setErro(error.message || "Erro ao carregar o dashboard.");
      } finally {
        if (isFirstLoad) setCarregando(false);
      }
    };

    carregarHome(true);

    const intervalo = setInterval(() => {
      carregarHome(false);
    }, 5000);

    return () => clearInterval(intervalo);
  }, [idUsuario]);

  return { dadosHome, carregando, erro };
};