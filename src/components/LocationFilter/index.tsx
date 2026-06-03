import { useState } from 'react';
// Ajuste o caminho de importação para onde o seu componente Button realmente estiver
import { Button } from '../Button'; 

interface LocationFilterProps {
  bairroAtual: string;
  aoSelecionar: (bairro: string, cidade: string) => void;
  aoCancelar: () => void;
}

export function LocationFilter({ bairroAtual, aoSelecionar, aoCancelar }: LocationFilterProps) {
  const [inputCidade, setInputCidade] = useState('');
  const [inputBairro, setInputBairro] = useState('');

  const lidarComBuscaManual = () => {
    // Garante que não faça uma busca totalmente em branco
    if (inputCidade.trim() !== '' || inputBairro.trim() !== '') {
      aoSelecionar(inputBairro, inputCidade);
    }
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      padding: '20px',
      borderRadius: '8px',
      marginTop: '15px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <p style={{ margin: 0, fontWeight: 'bold', color: '#333', fontSize: '16px' }}>
        Onde você quer buscar?
      </p>
      
      {/* Usando o seu componente Button para o atalho de GPS */}
      <Button 
        onClick={() => aoSelecionar('Centro', 'Jandira')}
        style={{
          width: '100%',
          background: bairroAtual === 'Centro' ? '#005bb5' : '#0070f3',
          color: '#fff'
        }}
      >
        📍 Usar Minha Localização Atual
      </Button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #ddd' }} />
        <span style={{ fontSize: '12px', color: '#888' }}>OU DIGITE</span>
        <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #ddd' }} />
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Cidade (ex: Cotia)" 
          value={inputCidade}
          onChange={(e) => setInputCidade(e.target.value)}
          style={{
            flex: 1,
            minWidth: '120px',
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            outline: 'none'
          }}
        />
        <input 
          type="text" 
          placeholder="Bairro (ex: Alphaville)" 
          value={inputBairro}
          onChange={(e) => setInputBairro(e.target.value)}
          style={{
            flex: 1,
            minWidth: '120px',
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            outline: 'none'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '4px' }}>
        {/* Usando o seu componente Button para Cancelar */}
        <Button 
          onClick={aoCancelar}
          style={{
            background: '#fff',
            color: '#ff4d4f',
            border: '1px solid #ff4d4f'
          }}
        >
          Cancelar
        </Button>
        
        {/* Usando o seu componente Button para Buscar */}
        <Button 
          onClick={lidarComBuscaManual}
          style={{
            background: '#333',
            color: '#fff',
            border: 'none'
          }}
        >
          Buscar
        </Button>
      </div>

    </div>
  );
}