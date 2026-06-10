import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi'; // Puxa a flecha minimalista
import './backButton.css';

interface BackButtonProps {
  to?: string;
  onClick?: () => void; // Adicionamos isso!
}

export function BackButton({ to, onClick }: BackButtonProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onClick) {
      onClick(); // Se passarmos a função do stepper, ele usa ela!
    } else if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button className="back-button" onClick={handleBack} title="Voltar">
      <FiArrowLeft size={26} />
    </button>
  );
}