import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi'; // Puxa a flecha minimalista
import '../../styles/backButton.css';

interface BackButtonProps {
  to?: string; // Caminho opcional para forçar a volta para uma tela específica
}

export function BackButton({ to }: BackButtonProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to) {
      navigate(to); // Vai para a rota específica (ex: "/")
    } else {
      navigate(-1); // Volta para a página anterior do histórico
    }
  };

  return (
    <button className="back-button" onClick={handleBack} title="Voltar">
      <FiArrowLeft size={26} />
    </button>
  );
}