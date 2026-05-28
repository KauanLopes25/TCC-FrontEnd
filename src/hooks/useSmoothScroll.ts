import { useCallback } from 'react';

export function useSmoothScroll() {
  const rolarPara = useCallback((id: string) => {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return { rolarPara };
}