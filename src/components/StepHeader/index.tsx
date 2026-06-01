import './stepHeader.css'

interface StepHeaderProps {
        circuloAtivo: number
        porcentagem: number
    }

const ETAPAS = [
        {id: 1, label: 'Lavanderia'},
        {id: 2, label: 'Cesto'},
        {id: 3, label: 'Pagamento'},
        {id: 4, label: 'Acompanhamento'}
    ]

export function StepHeader({circuloAtivo, porcentagem}: StepHeaderProps){
    return(
        <div className="step-header-container">
            <div className="stepper-wrapper">
                <div className="progress-line-bg">
                    <div className="progress-line-fill"
                    style={{width: `${porcentagem}%`}}
                    />
                </div>
                {ETAPAS.map((etapa) => {
                    const isConcluido = etapa.id < circuloAtivo
                    const isAtivo = etapa.id === circuloAtivo

                    // Lógica de estado perfeitamente separada
                    let classeDoPasso = 'step-item';

                    if (isAtivo) {
                        classeDoPasso = 'step-item active';
                    } else if (isConcluido) {
                        classeDoPasso = 'step-item completed';
                    }

                    return(
                        <div key={etapa.id} className={classeDoPasso}>
                            <div className="outer-circle">
                                <div className="inner-circle">
                                0{etapa.id}
                                </div>
                            </div>

                            <span className="step-label">
                                 {etapa.label}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
            
    )
}