interface SurtidorProps {
  nro: number;
  avisarAlJefe: (nro: number, estado: string) => void;
}

function Surtidor({ nro, avisarAlJefe }: SurtidorProps) {
  return (
    <div style={{ border: '2px solid blue', padding: '10px', width: '150px' }}>
      <h3>Surtidor {nro}</h3>
      
      <button 
        onClick={() => avisarAlJefe(nro, "CARGANDO...")}
        style={{ backgroundColor: 'red', color: 'white', display: 'block', marginBottom: '5px', width: '100%' }}
      >
        OCUPAR
      </button>

      <button 
        onClick={() => avisarAlJefe(nro, "LIBRE")}
        style={{ backgroundColor: 'green', color: 'white', display: 'block', width: '100%' }}
      >
        LIBERAR
      </button>
      <button 
        onClick={() => avisarAlJefe(nro, "Fuera de servicio")}
        style={{ backgroundColor: 'pink', color: 'white', display: 'block', marginBottom: '5px', width: '100%' }}
      >
        Fuera de servicio
      </button>
          <button 
        onClick={() => avisarAlJefe(nro, "CARGANDO")}
        style={{ backgroundColor: 'yellow', color: 'white', display: 'block', marginBottom: '5px', width: '100%' }}
      >
        CARGANDO
      </button>
    </div>
  );
}

export default Surtidor;