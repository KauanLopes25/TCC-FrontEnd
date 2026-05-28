interface ServiceCardProps {
  numero: number;
  icone: string;
  titulo: string;
  descricao: string;
}

export function ServiceCard({ numero, icone, titulo, descricao }: ServiceCardProps) {
  return (
    <div className="service-card">
      <div className="card-number">{numero}</div>
      <div className="icon-wrapper">{icone}</div>
      <h4>{titulo}</h4>
      <p>{descricao}</p>
    </div>
  );
}