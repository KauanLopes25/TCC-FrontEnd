import { useState, useEffect } from 'react';
import { buscarPedidosDoUsuario } from '../services/pedidoService'; // Ajuste o caminho se necessário

export function usePedidos(usuarioId: number) {
  // Estados para controlar a tela
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPedidos() {
      if (!usuarioId) return; // Trava de segurança

      setCarregando(true);
      setErro(null);

      try {
        const resultado = await buscarPedidosDoUsuario(usuarioId);
        
        // Agora pegamos o caminho exato que o seu back-end mandou:
        let listaPedidos = resultado.items?.Pedido || [];
        
        // Garantia extra
        if (!Array.isArray(listaPedidos)) {
          listaPedidos = [];
        }
        
        setPedidos(listaPedidos);
        
      } catch (err: any) {
        setErro(err.message || 'Falha ao buscar os pedidos.');
      } finally {
        setCarregando(false);
      }
    }

    fetchPedidos();
  }, [usuarioId]); // Se o ID do usuário mudar, ele busca de novo

  return { pedidos, carregando, erro };
}