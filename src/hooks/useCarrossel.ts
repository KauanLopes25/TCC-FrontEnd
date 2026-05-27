import { useState, useEffect, useCallback } from "react";

export function useCarrossel(totalItens: number){
    const [imagemAtiva, setImagemAtiva] = useState(0)

    const proximaImagem = useCallback(() => {
        setImagemAtiva((atual) => (atual === totalItens - 1 ? 0 : atual +1))
    }, [totalItens])

    const imagemAnterior = useCallback(() => {
    setImagemAtiva((atual) => (atual === 0 ? totalItens - 1 : atual - 1));
    }, [totalItens]);

    useEffect(() => {
        if(totalItens === 0) return
        
        const relogio = setInterval(() => {
            proximaImagem()
        }, 5000)

        return () => clearInterval(relogio)
    }, [proximaImagem, totalItens])

    return {
        imagemAtiva,
        proximaImagem,
        imagemAnterior,
        setImagemAtiva
    }
}