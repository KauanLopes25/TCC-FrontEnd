import { useState, useEffect } from 'react';
import { buscarDetalhesLavanderia } from '../services/laundryService'; 

export const useLavanderiaDetalhes = (idLavanderia: number | null) => {
  const [dados, setDados] = useState<any>(null);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const carregarDetalhes = async () => {
      // Se não tem ID ainda, não faz nada
      if (!idLavanderia) return;
      
      setCarregando(true);
      setErro(null);

      try {
        // O Hook pede os dados para o Service "cego" de como a rede funciona
        const resultado = await buscarDetalhesLavanderia(idLavanderia);

        // Verifica se a API devolveu sucesso. Ajuste o caminho do array conforme sua Controller
        if (resultado.status_code === 200 || resultado.status) {
          setDados(resultado.items.lavanderia[0]); 
        } else {
          setErro("Não foi possível carregar os detalhes.");
        }
      } catch (error) {
        setErro("Erro de conexão. Tente novamente mais tarde.");
      } finally {
        setCarregando(false);
      }
    };

    carregarDetalhes();
  }, [idLavanderia]);

  return { dados, carregando, erro };
};