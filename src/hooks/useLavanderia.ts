import { useState, useEffect } from 'react';
import { buscarLavanderias, favoritar, desfavoritar } from '../services/laundryService';

export function useLavanderia() {
  // Estados Base
  const [busca, setBusca] = useState('');
  const [filtrosSelecionados, setFiltrosSelecionados] = useState<string[]>([]);
  const [favoritos, setFavoritos] = useState<number[]>([1]); 

  // Estados de Localização (Distância)
  const [bairroFiltro, setBairroFiltro] = useState('');
  const [cidadeFiltro, setCidadeFiltro] = useState('');
  const [mostrarModalDistancia, setMostrarModalDistancia] = useState(false);

  // Estados da API
  const [lavanderias, setLavanderias] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Motor de Busca
  useEffect(() => {
    async function carregarDados() {
      setCarregando(true);
      try {
        console.log("🛠️ DADOS NO HOOK ->", { busca, filtrosSelecionados, bairroFiltro, cidadeFiltro });
        const dadosApi = await buscarLavanderias(busca, filtrosSelecionados, bairroFiltro, cidadeFiltro);
        const listaExtraida = dadosApi.items?.lavanderia || [];
        setLavanderias(Array.isArray(listaExtraida) ? listaExtraida : []);
      } catch (error: any) {
        console.error('Falha ao buscar:', error.message);
        setLavanderias([]); 
      } finally {
        setCarregando(false);
      }
    }
    carregarDados();
  }, [busca, filtrosSelecionados, bairroFiltro, cidadeFiltro]);

  const lidarComCliqueNoFiltro = (nomeDoFiltro: string) => {
    setFiltrosSelecionados((filtrosAnteriores) => {
      if (filtrosAnteriores.includes(nomeDoFiltro)) {
        if (nomeDoFiltro === 'distancia') {
          setBairroFiltro('');
          setCidadeFiltro('');
          setMostrarModalDistancia(false);
        }
        return filtrosAnteriores.filter((filtro) => filtro !== nomeDoFiltro);
      } else {
        if (nomeDoFiltro === 'distancia') {
          setMostrarModalDistancia(true);
        }
        return [...filtrosAnteriores, nomeDoFiltro];
      }
    });
  };

  const lidarComFavorito = async (idDaLavanderia: number) => {
    // Para o TCC, simulamos que o usuário logado é o de ID 1. 
    // No futuro, isso viria do contexto de login (ex: JWT)
    const ID_USUARIO_LOGADO = 1; 
    const isJaFavorito = favoritos.includes(idDaLavanderia);

    if (isJaFavorito) {
      // 1. Optimistic UI: Remove da tela imediatamente
      setFavoritos(prev => prev.filter(f => f !== idDaLavanderia)); 
      
      try {
        // 2. Avisa o banco de dados
        await desfavoritar(ID_USUARIO_LOGADO, idDaLavanderia);
      } catch (error) {
        // 3. Se a internet cair ou o Node.js falhar, devolve o coração pra tela
        console.error("Falha ao desfavoritar:", error);
        setFavoritos(prev => [...prev, idDaLavanderia]); 
      }
    } else {
      // 1. Optimistic UI: Acende o coração imediatamente
      setFavoritos(prev => [...prev, idDaLavanderia]); 
      
      try {
        // 2. Avisa o banco de dados
        await favoritar(ID_USUARIO_LOGADO, idDaLavanderia);
      } catch (error) {
        // 3. Se falhar, apaga o coração
        console.error("Falha ao favoritar:", error);
        setFavoritos(prev => prev.filter(f => f !== idDaLavanderia));
      }
    }
  };

 const selecionarLocalizacao = (bairro: string, cidade: string) => {
  setBairroFiltro(bairro);
  setCidadeFiltro(cidade);
  setMostrarModalDistancia(false); // A MÁGICA: Fecha o painel para vermos os cards filtrados!
};

  const cancelarLocalizacao = () => {
    setBairroFiltro('');
    setCidadeFiltro('');
    setMostrarModalDistancia(false);
    setFiltrosSelecionados(prev => prev.filter(f => f !== 'distancia'));
  };

  return {
    busca,
    setBusca,
    filtrosSelecionados,
    lidarComCliqueNoFiltro,
    bairroFiltro,
    mostrarModalDistancia,
    selecionarLocalizacao,
    cancelarLocalizacao,
    lavanderias,
    carregando,
    favoritos,
    lidarComFavorito
  };
}