/**
 * Store de Zustand para notificaciones en tiempo real
 * Maneja el estado de notificaciones de ventas nuevas
 */

import { create } from 'zustand';

export interface SaleNotification {
  id_venta: number;
  /** Código de operación para mostrar (ej. MAX-00000001). Si no viene, el UI lo deriva de id_venta. */
  cod_interno?: string | null;
  estado_pago: 'pendiente' | 'aprobado' | 'cancelado' | 'rechazado';
  fecha: string;
  created_at: string;
  isRead: boolean;
  // Campos opcionales que pueden venir del backend en el futuro
  cliente?: string;
  producto?: string;
  total?: number;
}

export type AddNotificationOptions = {
  /** Si es true, no se actualiza lastSaleEvent (útil al hidratar desde API para no disparar toasts) */
  silent?: boolean;
};

export interface MpPaymentUpdateEvent {
  id_venta: number;
  payment_id: string;
  status_mp: string;
  estado_pago: string;
  fecha: string;
}

interface NotificationsState {
  notifications: SaleNotification[];
  hasNewSales: boolean;
  lastSaleEvent: SaleNotification | null;
  lastMpPaymentUpdate: MpPaymentUpdateEvent | null;
  addNotification: (notification: Omit<SaleNotification, 'isRead' | 'created_at'>, options?: AddNotificationOptions) => void;
  notifyMpPaymentUpdate: (update: MpPaymentUpdateEvent) => void;
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
  lastMpPaymentUpdate: null,
  
  notifyMpPaymentUpdate: (update) => {
    set((state) => {
      const estado = update.estado_pago as SaleNotification['estado_pago'];
      const updatedNotifications = state.notifications.map((n) =>
        n.id_venta === update.id_venta
          ? { ...n, estado_pago: estado, isRead: false }
          : n
      );
      const hadNotification = state.notifications.some((n) => n.id_venta === update.id_venta);
      return {
        notifications: hadNotification ? updatedNotifications : state.notifications,
        hasNewSales: true,
        lastMpPaymentUpdate: update,
      };
    });
  },

  addNotification: (notification, options) => {
    const silent = options?.silent === true;
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
        ...(silent ? {} : { lastSaleEvent: newNotification }),
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
      lastMpPaymentUpdate: null,
    });
  },
  
  unreadCount: () => {
    return get().notifications.filter((n) => !n.isRead).length;
  },
}));

