import { useState } from 'react';

// Definimos la interface para que el formulario sepa qué datos devolver
interface FormularioModalProps {
  onClose: () => void; // Función para cerrar el modal
  onSave: (data: Omit<Producto, 'id'>) => void; // Función para guardar (sin el ID, que se genera después)
}

interface Producto { // Repetimos la interface Producto aquí para no importar
  id: number;
  nombre: string;
  categoria: string;
  cantidad: number;
  precio: number;
}

const FormularioModal = ({ onClose, onSave }: FormularioModalProps) => {
  // Estado local para los inputs del formulario
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState(0);
  const [precio, setPrecio] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue (comportamiento por defecto de HTML)
    onSave({ nombre, categoria: "Varios", cantidad, precio }); // Pasamos los datos al componente padre (App.tsx)
    onClose(); // Cerramos el modal
  };

  return (
    // Fondo oscuro del modal
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      
      {/* Contenido del Modal */}
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-4">Agregar Producto</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input 
              type="text" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} // Captura lo que escribís en el input
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Cantidad</label>
            <input 
              type="number" 
              value={cantidad} 
              onChange={(e) => setCantidad(Number(e.target.value))} // Convierte el texto del input a número
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
              required
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Precio ($AR)</label>
            <input 
              type="number" 
              value={precio} 
              onChange={(e) => setPrecio(Number(e.target.value))} // Convierte el texto del input a número
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
              required
              min="0"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-md"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioModal;