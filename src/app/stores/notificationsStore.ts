/**
 * Store de Zustand para notificaciones en tiempo real
 * Maneja el estado de notificaciones de ventas nuevas
 */

import { create } from 'zustand';

export interface SaleNotification {
  id_venta: number;
  estado_pago: 'pendiente' | 'aprobado' | 'cancelado';
  fecha: string;
  created_at: string;
  isRead: boolean;
  // Campos opcionales que pueden venir del backend en el futuro
  cliente?: string;
  producto?: string;
  total?: number;
}

interface NotificationsState {
  notifications: SaleNotification[];
  hasNewSales: boolean;
  lastSaleEvent: SaleNotification | null;
  addNotification: (notification: Omit<SaleNotification, 'isRead' | 'created_at'>) => void;
  markAsRead: (id_venta: number) => void;
  markAllAsRead: () => void;
  removeNotification: (id_venta: number) => void;
  clearNotifications: () => void;
  unreadCount: () => number;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  hasNewSales: false,
  lastSaleEvent: null,
  
  addNotification: (notification) => {
    const newNotification: SaleNotification = {
      ...notification,
      isRead: false,
      created_at: notification.fecha || new Date().toISOString(),
    };
    
    set((state) => {
      // Evitar duplicados
      const exists = state.notifications.some(n => n.id_venta === notification.id_venta);
      if (exists) {
        return state;
      }
      
      return {
        notifications: [newNotification, ...state.notifications].slice(0, 50), // Limitar a 50 notificaciones
        hasNewSales: true,
        lastSaleEvent: newNotification,
      };
    });
  },
  
  markAsRead: (id_venta) => {
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id_venta === id_venta ? { ...n, isRead: true } : n
      );
      const unreadCount = updated.filter((n) => !n.isRead).length;
      return {
        notifications: updated,
        hasNewSales: unreadCount > 0,
      };
    });
  },
  
  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      hasNewSales: false,
    }));
  },
  
  removeNotification: (id_venta) => {
    set((state) => {
      const updated = state.notifications.filter((n) => n.id_venta !== id_venta);
      const unreadCount = updated.filter((n) => !n.isRead).length;
      return {
        notifications: updated,
        hasNewSales: unreadCount > 0,
      };
    });
  },
  
  clearNotifications: () => {
    set({
      notifications: [],
      hasNewSales: false,
      lastSaleEvent: null,
    });
  },
  
  unreadCount: () => {
    return get().notifications.filter((n) => !n.isRead).length;
  },
}));

