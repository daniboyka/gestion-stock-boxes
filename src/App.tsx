import { useState } from 'react';
import FormularioModal from './FormularioModal'; 
import OrdenPor from './OrdenPor';
import FiltrarPor from './FiltrarPor';

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  cantidad: number;
  precio: number;
}

function App() {
  const [productos, setProductos] = useState<Producto[]>([
    { id: 1, nombre: "Aceite YPF Elaion 10W40", categoria: "Aceites", cantidad: 15, precio: 12500 },
    { id: 2, nombre: "Filtro de Aire Fram", categoria: "Filtros", cantidad: 8, precio: 4500 },
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [criterio, setCriterio] = useState<'nombre' | 'precio'>('nombre');
const [direccion, setDireccion] = useState<'asc' | 'desc'>('asc');

// Esta variable se calcula sola en cada renderizado
const productosAMostrar = productos
  .filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()))
  .sort((a, b) => {
    let comparacion = 0;

    if (criterio === 'nombre') {
      comparacion = a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase());
    } else {
      comparacion = a.precio - b.precio;
    }

    // Si la dirección es 'desc', invertimos el resultado multiplicando por -1
    return direccion === 'asc' ? comparacion : comparacion * -1;
  });
  
  const eliminarProducto = (idABorrar: number) => {
    const nuevaLista = productos.filter(p => p.id !== idABorrar);
    setProductos(nuevaLista);
  };

  const handleSaveProduct = (newProductData: Omit<Producto, 'id'>) => {
    const nuevoProducto: Producto = {
      ...newProductData,
      id: Date.now(),
    };
    setProductos([...productos, nuevoProducto]);
  };

const manejarOrden = (nuevoCriterio: 'nombre' | 'precio') => {
  if (nuevoCriterio === criterio) {
    // Si el usuario toca el mismo botón, invertimos la dirección
    setDireccion(direccion === 'asc' ? 'desc' : 'asc');
  } else {
    // Si elige uno nuevo, empezamos siempre en ascendente
    setCriterio(nuevoCriterio);
    setDireccion('asc');
  }
};

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans text-gray-900">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gestión de Stock - Boxes</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md"
          >
            + Nuevo Producto
          </button>
        </header>

        <div className="flex gap-4 mb-4">
          <OrdenPor onOrdenar={manejarOrden} />
          {/* 2. PROP CORREGIDA (pasamos la función setBusqueda) */}
          <FiltrarPor onBuscar={setBusqueda} />
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-200 border-b">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold">Producto</th>
                <th className="px-6 py-3 text-sm font-semibold text-center">Stock</th>
                <th className="px-6 py-3 text-sm font-semibold">Precio</th>
                <th className="px-6 py-3 text-sm font-semibold text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* USAMOS LA LISTA FILTRADA */}
              {productosAMostrar.map((prod) => (
                <tr key={prod.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{prod.nombre}</td>
                  <td className={`px-6 py-4 text-center font-bold ${prod.cantidad < 10 ? 'text-red-500' : 'text-green-600'}`}>
                    {prod.cantidad}
                  </td>
                  <td className="px-6 py-4">${prod.precio.toLocaleString('es-AR')}</td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => eliminarProducto(prod.id)}
                      className="text-red-500 hover:text-red-700 font-bold border border-red-500 px-2 py-1 rounded text-xs"
                    >
                      X Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {productosAMostrar.length === 0 && (
            <p className="p-10 text-center text-gray-500 italic">No se encontraron productos.</p>
          )}
        </div>
      </div>

      {isModalOpen && (
        <FormularioModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSaveProduct} 
        />
      )}
    </div>
  );
}

export default App;