import { useState } from 'react';
import { supabase } from './supabaseClient';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      alert(error.message);
    } else {
      alert('¡Revisa tu correo electrónico para el enlace de inicio de sesión!');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Gestión de Stock Boxes</h1>
        <p className="mb-4 text-center">Ingresa con tu email para acceder al inventario.</p>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Tu dirección de email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-lg disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Enviar enlace de login'}
          </button>
        </form>
      </div>
    </div>
  );
}