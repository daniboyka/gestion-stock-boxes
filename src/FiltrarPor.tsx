interface FiltrarPorProps {
  onBuscar: (texto: string) => void;
}

function FiltrarPor(criterio : FiltrarPorProps) {
return (
    <div>
        <input type="text" 
        onChange ={e => criterio.onBuscar(e.target.value)}
            placeholder="Buscar producto..."
            
        /> 
    </div>
)

}

export default FiltrarPor