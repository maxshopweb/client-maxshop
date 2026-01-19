/**
 * Hook para manejar la conexión WebSocket
 * Se conecta automáticamente cuando el usuario es admin
 */

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { websocketClient } from '../lib/websocket';
import { useNotificationsStore } from '../stores/notificationsStore';
import { useAuth } from '../context/AuthContext';

export function useWebSocket() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { clearNotifications } = useNotificationsStore();

  useEffect(() => {
    // Solo conectar si el usuario es admin
    if (user?.rol !== 'ADMIN') {
      return;
    }

    // Conectar WebSocket
    websocketClient.connect();

    // Limpiar notificaciones cuando se entra a /admin/ventas
    if (pathname === '/admin/ventas') {
      clearNotifications();
    }

    // Cleanup: desconectar al desmontar o cambiar de usuario
    return () => {
      // No desconectar aquí, mantener la conexión mientras el usuario esté en el admin
      // Solo desconectar si el usuario cambia o se desmonta completamente
    };
  }, [user?.rol, pathname, clearNotifications]);

  // Desconectar cuando el usuario no es admin o se desmonta el componente
  useEffect(() => {
    if (user?.rol !== 'ADMIN') {
      websocketClient.disconnect();
    }
  }, [user?.rol]);
}

