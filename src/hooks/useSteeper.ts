import { useState } from "react";

export function useSteeper(){
    const [passoAtual, setPassoAtual] = useState<number>(1);

    const proximoPasso = () => {
        if(passoAtual < 6) setPassoAtual(prev => prev + 1)
    }
    const passoAnterior = () => {
        if(passoAtual > 1) setPassoAtual(prev => prev - 1)
    }

    const regrasVisuais: Record<number, {porcentagem: number; circuloAtivo: number}> = {
        1: {porcentagem: 0, circuloAtivo: 1},
        2: {porcentagem: 16.7, circuloAtivo: 1},
        3: {porcentagem: 33.4, circuloAtivo: 2},
        4: {porcentagem: 50.1, circuloAtivo: 2},
        5: {porcentagem: 66.8, circuloAtivo: 3},
        6: {porcentagem: 100, circuloAtivo: 4}
    }

    const {porcentagem, circuloAtivo} = regrasVisuais[passoAtual]

    return {
        passoAtual,
        circuloAtivo,
        porcentagem,
        proximoPasso,
        passoAnterior,
        setPassoAtual
    }
}