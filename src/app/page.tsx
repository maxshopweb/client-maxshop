'use client';

import { Button } from "./components/ui/Button";
import { useAuth } from "./context/AuthContext";
import { useAuthStore } from "./stores/userStore";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

export default function Home() {
  const { logout, isAuthenticated, user, loading } = useAuth();
  const usuario = useAuthStore((state) => state.usuario);

  const handleLogout = async () => {
    try {
      const success = await logout();
      if (success) {
        toast.success('Sesión cerrada exitosamente');
        // Redirigir a login después de un momento
        setTimeout(() => {
          window.location.href = '/login';
        }, 500);
      } else {
        toast.error('Error al cerrar sesión');
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  return (
    <div className="p-8 space-y-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">MaxShop - Home</h1>
      
      {isAuthenticated && usuario && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4 text-secundario dark:text-white">
          <h2 className="text-xl font-semibold">Información del Usuario</h2>
          <div className="space-y-2">
            <p><strong>Email:</strong> {usuario.email}</p>
            <p><strong>Nombre:</strong> {usuario.nombre}</p>
            <p><strong>Username:</strong> {usuario.username}</p>
            <p><strong>Rol:</strong> {usuario.rol}</p>
            <p><strong>Estado:</strong> {usuario.estado ?? 'N/A'}</p>
          </div>
          
          <Button 
            onClick={handleLogout} 
            variant="primary" 
            disabled={loading}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            {loading ? 'Cerrando sesión...' : 'Cerrar Sesión'}
          </Button>
        </div>
      )}

      {!isAuthenticated && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <p>No estás autenticado. <a href="/login" className="text-blue-600 hover:underline">Inicia sesión</a></p>
        </div>
      )}
    </div>
  );
}
