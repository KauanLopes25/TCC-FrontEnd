import type { ReactNode } from 'react';
import { colors } from '../../themes/colors';
import '../../styles/background.css';

interface BackgroundProps {
  children: ReactNode;
}

export function Background({ children }: BackgroundProps) {
  const gradientStyle = {
    background: `linear-gradient(135deg, ${colors.firstColorDegrader} 0%, ${colors.secundaryColorDegrader} 100%)`
  };

  return (
    <div className="global-background" style={gradientStyle}>
      {children}
    </div>
  );
}