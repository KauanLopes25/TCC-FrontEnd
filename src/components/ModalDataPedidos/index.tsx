import React from 'react';
import { FiX } from 'react-icons/fi';
import '../FilterBarPedidos/filterBarPedidos.css'; // Usando o mesmo arquivo para organizar

interface ModalDataPedidoProps {
  opcaoAtual: string | null;
  aoSelecionar: (opcao: string | null, label: string | null) => void;
  aoFechar: () => void;
}

export function ModalDataPedido({ opcaoAtual, aoSelecionar, aoFechar }: ModalDataPedidoProps) {
  
  // Função auxiliar para fechar se clicar fora da caixinha (no fundo escuro)
  const lidarComCliqueFundo = (e: React.MouseEvent) => {
    if ((e.target as HTMLDivElement).className === 'modal-overlay') {
      aoFechar();
    }
  };

  return (
    <div className="modal-overlay" onClick={lidarComCliqueFundo}>
      <div className="modal-content-data">
        
        <div className="modal-header">
          <h3>Filtrar por Data</h3>
          <button className="btn-fechar-modal" onClick={aoFechar}>
            <FiX size={24} />
          </button>
        </div>

        <div className="modal-body-data">
          <button 
            className={`opcao-data ${opcaoAtual === '7dias' ? 'selecionada' : ''}`}
            onClick={() => aoSelecionar('7dias', 'Últimos 7 dias')}
          >
            Últimos 7 dias
          </button>
          
          <button 
            className={`opcao-data ${opcaoAtual === '30dias' ? 'selecionada' : ''}`}
            onClick={() => aoSelecionar('30dias', 'Últimos 30 dias')}
          >
            Últimos 30 dias
          </button>
          
          <button 
            className={`opcao-data ${opcaoAtual === null ? 'selecionada' : ''}`}
            onClick={() => aoSelecionar(null, null)}
          >
            Todos os pedidos
          </button>
        </div>

      </div>
    </div>
  );
}