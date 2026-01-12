import { useState, useEffect } from 'react'; // Agregado useEffect

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  cantidad: number;
  precio: number;
}

interface FormularioModalProps {
  onClose: () => void;
  onSave: (data: Omit<Producto, 'id'>) => void;
  productoExistente?: Producto | null; // Agregada esta línea
}

const FormularioModal = ({ onClose, onSave, productoExistente }: FormularioModalProps) => {
  const [nombre, setNombre] = useState(productoExistente?.nombre || '');
  const [cantidad, setCantidad] = useState(productoExistente?.cantidad || 0);
  const [precio, setPrecio] = useState(productoExistente?.precio || 0);

  useEffect(() => {
    if (productoExistente) {
      setNombre(productoExistente.nombre);
      setCantidad(productoExistente.cantidad);
      setPrecio(productoExistente.precio);
    }
  }, [productoExistente]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ nombre, categoria: "Varios", cantidad, precio });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-4">
          {productoExistente ? 'Editar Producto' : 'Agregar Producto'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input 
              type="text" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Cantidad</label>
            <input 
              type="number" 
              value={cantidad} 
              onChange={(e) => setCantidad(Number(e.target.value))}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Precio</label>
            <input 
              type="number" 
              value={precio} 
              onChange={(e) => setPrecio(Number(e.target.value))}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 border rounded-md">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioModal;