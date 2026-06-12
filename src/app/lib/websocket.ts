/**
 * Cliente WebSocket para notificaciones en tiempo real
 * 
 * Características:
 * - Reconexión automática
 * - Autenticación con Firebase JWT
 * - Manejo de errores
 * - Solo para admins
 */

import { useNotificationsStore } from '../stores/notificationsStore';
import { getAuthToken } from '../utils/cookies';
import { refreshFirebaseToken, isTokenNearExpiry } from '../utils/tokenRefresh';

/** Payload que envía el backend en el evento SALE_CREATED */
interface SaleCreatedPayload {
  id_venta: number;
  estado_pago: 'pendiente' | 'aprobado' | 'cancelado' | 'rechazado';
  fecha: string;
  venta?: {
    id_venta: number;
    cod_interno?: string | null;
    estado_pago?: string;
    fecha?: string;
    total_neto?: number | null;
    cliente?: { usuario?: { nombre?: string; apellido?: string; email?: string } } | null;
    detalles?: { producto?: { nombre?: string } }[];
  } | null;
}

interface MpPaymentUpdatedPayload {
  id_venta: number;
  payment_id: string;
  status_mp: string;
  estado_pago: string;
  fecha: string;
}

interface WebSocketMessage {
  type: string;
  message?: string;
  event?: string;
  payload?: SaleCreatedPayload | MpPaymentUpdatedPayload;
}

class WebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectDelay = 1000; // 1 segundo inicial
  private maxReconnectDelay = 30000; // 30 segundos máximo
  private reconnectTimer: NodeJS.Timeout | null = null;
  private isManualClose = false;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private readonly HEARTBEAT_INTERVAL = 30000; // 30 segundos
  private isReauthenticating = false; // Prevenir múltiples intentos simultáneos

  /**
   * Obtiene la URL del WebSocket
   */
  private getWebSocketURL(): string {
    // En producción, usar la URL del backend desde env
    // En desarrollo, usar localhost
    if (process.env.NEXT_PUBLIC_WS_URL) {
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL;
      // Si ya incluye protocolo, usarlo tal cual
      if (wsUrl.startsWith('ws://') || wsUrl.startsWith('wss://')) {
        return `${wsUrl}/ws`;
      }
      // Si no, determinar protocolo según la página actual
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      return `${protocol}//${wsUrl}/ws`;
    }
    
    // Fallback: usar localhost para desarrollo
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = 'localhost:3001';
    return `${protocol}//${host}/ws`;
  }

  /**
   * Conecta al servidor WebSocket
   */
  connect(): void {
    if (process.env.NEXT_PUBLIC_DISABLE_WS === 'true') {
      return;
    }

    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    if (this.ws?.readyState === WebSocket.CONNECTING) {
      return;
    }

    try {
      const url = this.getWebSocketURL();

      this.ws = new WebSocket(url);

      this.ws.onopen = async () => {
        this.reconnectAttempts = 0;
        this.reconnectDelay = 1000;
        
        // Verificar si el token está próximo a expirar antes de autenticarse
        const token = getAuthToken();
        if (token && isTokenNearExpiry(token)) {
          console.log('🔄 [WebSocket] Token próximo a expirar, refrescando antes de autenticar...');
          try {
            const refreshedToken = await refreshFirebaseToken(true);
            if (refreshedToken) {
              // El token ya se actualizó en cookies, continuar con autenticación normal
              console.log('✅ [WebSocket] Token refrescado exitosamente');
            }
          } catch (error) {
            console.error('❌ [WebSocket] Error al refrescar token preventivamente:', error);
          }
        }
        
        this.authenticate();
        this.startHeartbeat();
      };

      this.ws.onmessage = (event) => {
        this.handleMessage(event.data);
      };

      this.ws.onerror = (error) => {
        console.error('❌ [WebSocket] Error:', error);
      };

      this.ws.onclose = (event) => {
        this.stopHeartbeat();

        // Solo reconectar si no fue un cierre manual
        if (!this.isManualClose) {
          this.scheduleReconnect();
        }
      };
    } catch (error) {
      console.error('❌ [WebSocket] Error al conectar:', error);
      this.scheduleReconnect();
    }
  }

  /**
   * Autentica el cliente con Firebase JWT
   * Intenta refrescar el token si está expirado
   */
  private authenticate(): void {
    // Prevenir múltiples intentos simultáneos
    if (this.isReauthenticating) {
      return;
    }

    const token = getAuthToken();
    
    if (!token) {
      console.warn('⚠️ [WebSocket] No hay token disponible, cerrando conexión');
      this.disconnect();
      return;
    }

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'auth',
        token,
      }));
    }
  }

  /**
   * Maneja el refresco del token cuando expira
   */
  private async handleTokenRefresh(): Promise<void> {
    if (this.isReauthenticating) {
      return; // Ya hay un refresh en progreso
    }

    this.isReauthenticating = true;
    console.log('🔄 [WebSocket] Intentando refrescar token...');

    try {
      // Refrescar el token
      const newToken = await refreshFirebaseToken(true); // Forzar refresh

      if (newToken && this.ws?.readyState === WebSocket.OPEN) {
        // Reautenticarse con el nuevo token
        console.log('✅ [WebSocket] Token refrescado, reautenticando...');
        this.ws.send(JSON.stringify({
          type: 'auth',
          token: newToken,
        }));
      } else {
        console.error('❌ [WebSocket] No se pudo refrescar el token');
        this.disconnect();
      }
    } catch (error) {
      console.error('❌ [WebSocket] Error al refrescar token:', error);
      this.disconnect();
    } finally {
      // Resetear el flag después de un delay para permitir que llegue la respuesta del servidor
      setTimeout(() => {
        this.isReauthenticating = false;
      }, 2000);
    }
  }

  /**
   * Maneja mensajes del servidor
   */
  private handleMessage(data: string): void {
    try {
      const message: WebSocketMessage = JSON.parse(data);

      switch (message.type) {
        case 'welcome':
          break;

        case 'auth_success':
          this.isReauthenticating = false;
          break;

        case 'auth_error':
          console.error('❌ [WebSocket] Error de autenticación:', message.message);
          
          // Verificar si es un error de token expirado
          const errorMessage = message.message || '';
          const isExpiredError = 
            errorMessage.includes('id-token-expired') ||
            errorMessage.includes('token has expired') ||
            errorMessage.includes('token expired') ||
            errorMessage.includes('expired');
          
          if (isExpiredError && !this.isReauthenticating) {
            // Intentar refrescar el token y reautenticarse
            this.handleTokenRefresh();
          } else {
            // Si no es error de expiración o ya estamos intentando refrescar, desconectar
            this.disconnect();
          }
          break;

        case 'event':
          if (message.event === 'SALE_CREATED' && message.payload) {
            const p = message.payload as SaleCreatedPayload;
            const { addNotification } = useNotificationsStore.getState();
            const v = p.venta;
            const cliente = v?.cliente?.usuario
              ? [v.cliente.usuario.nombre, v.cliente.usuario.apellido].filter(Boolean).join(' ').trim() || v.cliente.usuario.email
              : undefined;
            const producto = v?.detalles?.length && v.detalles[0]?.producto?.nombre
              ? v.detalles.length === 1 ? v.detalles[0].producto!.nombre : `${v.detalles.length} productos`
              : undefined;
            addNotification({
              id_venta: p.id_venta,
              estado_pago: p.estado_pago,
              fecha: p.fecha,
              cod_interno: v?.cod_interno ?? undefined,
              cliente: cliente ?? undefined,
              producto,
              total: v?.total_neto ?? undefined,
            });
          } else if (message.event === 'MP_PAYMENT_UPDATED' && message.payload) {
            const p = message.payload as MpPaymentUpdatedPayload;
            useNotificationsStore.getState().notifyMpPaymentUpdate(p);
          }
          break;

        case 'pong':
          // Respuesta al heartbeat
          break;

        default:
      }
    } catch (error) {
      console.error('❌ [WebSocket] Error al procesar mensaje:', error);
    }
  }

  /**
   * Programa una reconexión
   */
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ [WebSocket] Máximo de intentos de reconexión alcanzado');
      return;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.reconnectAttempts++;
    const delay = Math.min(
      this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1),
      this.maxReconnectDelay
    );

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  /**
   * Inicia el heartbeat para mantener la conexión viva
   */
  private startHeartbeat(): void {
    this.stopHeartbeat();
    
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, this.HEARTBEAT_INTERVAL);
  }

  /**
   * Detiene el heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Desconecta el cliente
   */
  disconnect(): void {
    this.isManualClose = true;
    this.stopHeartbeat();

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

  }

  /**
   * Verifica si está conectado
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// Exportar instancia singleton
export const websocketClient = new WebSocketClient();

