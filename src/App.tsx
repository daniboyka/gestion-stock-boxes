import { supabase } from './supabaseClient';
import { useState, useEffect } from 'react';
import FormularioModal from './FormularioModal'; 
import OrdenPor from './OrdenPor';
import FiltrarPor from './FiltrarPor';
import Auth from './Auth';

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  cantidad: number;
  precio: number;
}

function App() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [criterio, setCriterio] = useState<'nombre' | 'precio'>('nombre');
  const [direccion, setDireccion] = useState<'asc' | 'desc'>('asc');
  const [productoAEditar, setProductoAEditar] = useState<Producto | null>(null);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      // CORRECCIÓN: Accedemos a la propiedad 'subscription' antes de llamar a unsubscribe
      authListener.subscription.unsubscribe(); 
    };
  }, []);

  useEffect(() => {
    if (session) {
      traerProductos();
    }
  }, [session]);

  const traerProductos = async () => {
    const { data, error } = await supabase
      .from('productos')
      .select('*');
    if (error) console.log('error', error);
    else setProductos(data || []);
  };
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const productosAMostrar = productos
    .filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    .sort((a, b) => {
      let comparacion = 0;
      if (criterio === 'nombre') {
        comparacion = a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase());
      } else {
        comparacion = a.precio - b.precio;
      }
      return direccion === 'asc' ? comparacion : comparacion * -1;
    });

  const handleSaveProduct = async (newProductData: Omit<Producto, 'id'>) => {
    const { data, error } = await supabase
      .from('productos')
      .insert([newProductData])
      .select();
    if (error) {
      alert("Hubo un error al guardar el producto.");
      console.error(error);
    } else if (data && data.length > 0) {
      setProductos(prevProductos => [...prevProductos, data[0]]);
    }
  };
    
  const manejarOrden = (nuevoCriterio: 'nombre' | 'precio') => {
    if (nuevoCriterio === criterio) {
      setDireccion(direccion === 'asc' ? 'desc' : 'asc');
    } else {
      setCriterio(nuevoCriterio);
      setDireccion('asc');
    }
  };
    
  const actualizarProducto = async (datosEditados: Omit<Producto, 'id'>) => {
    if (!productoAEditar) return;
    const { data, error } = await supabase
      .from('productos')
      .update(datosEditados)
      .eq('id', productoAEditar.id)
      .select();
    if (error) {
      alert("Error al actualizar");
      console.error(error);
    } else if (data) {
      setProductos(prev => prev.map(p => p.id === productoAEditar.id ? data[0] : p));
      setProductoAEditar(null);
      setIsModalOpen(false);
    }
  };

  const eliminarProducto = async (idABorrar: number) => {
    const { error } = await supabase
      .from('productos')
      .delete()
      .eq('id', idABorrar);
    if (error) {
      console.error("Error al eliminar de Supabase:", error);
      alert("Hubo un error al eliminar el producto.");
    } else {
      const nuevaLista = productos.filter(p => p.id !== idABorrar);
      setProductos(nuevaLista);
    }
  };

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans text-gray-900">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gestión de Stock - Boxes</h1>
          <div className="flex gap-4 items-center">
            <button 
                onClick={handleLogout}
                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-lg text-sm"
            >
                Cerrar sesión
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md"
            >
              + Nuevo Producto
            </button>
          </div>
        </header>

        <div className="flex gap-4 mb-4">
          {/* Aquí se usan las funciones/componentes OrdenPor y FiltrarPor */}
          <OrdenPor onOrdenar={manejarOrden} /> 
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
              {productosAMostrar.map((prod) => (
                <tr key={prod.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{prod.nombre}</td>
                  <td className={`px-6 py-4 text-center font-bold ${prod.cantidad < 10 ? 'text-red-500' : 'text-green-600'}`}>
                    {prod.cantidad}
                  </td>
                  <td className="px-6 py-4">${prod.precio.toLocaleString('es-AR')}</td>
                  <td className="px-6 py-4 text-center">
                    {/* Aquí se usan las funciones eliminarProducto y setProductoAEditar (que llama a actualizarProducto) */}
                    <button 
                      onClick={() => {
                        setProductoAEditar(prod);
                        setIsModalOpen(true);
                      }}
                      className="text-blue-500 hover:text-blue-700 font-bold border border-blue-500 px-2 py-1 rounded text-xs mr-2"
                    >
                      Editar
                    </button>
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
          onSave={productoAEditar ? actualizarProducto : handleSaveProduct} 
          productoExistente={productoAEditar}
        />
      )}
    </div>
  );
}

export default App;