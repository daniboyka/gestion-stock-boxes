// Definimos los criterios posibles para que TypeScript nos ayude
type CriterioOrden = 'nombre' | 'precio';

interface OrdenPorProps {
  onOrdenar: (criterio: CriterioOrden) => void;
}

const OrdenPor = ({ onOrdenar }: OrdenPorProps) => {
  return (
    <div className="flex gap-2 mb-4">
      <span className="text-sm font-medium text-gray-500 self-center">Ordenar por:</span>
      
      <button 
        onClick={() => onOrdenar('nombre')}
        className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1 rounded-md text-sm shadow-sm transition"
      >
        Nombre (A-Z)
      </button>

      <button 
        onClick={() => onOrdenar('precio')}
        className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1 rounded-md text-sm shadow-sm transition"
      >
        Menor Precio
      </button>
    </div>
  );
};

export default OrdenPor;