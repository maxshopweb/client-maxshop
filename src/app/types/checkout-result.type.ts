// Estados de pago de Mercado Pago (según documentación oficial)
export type MercadoPagoStatus = 
  | 'pending'        // Pago pendiente (ticket, transferencia, etc.)
  | 'approved'       // Pago aprobado y acreditado ✅
  | 'authorized'     // Pago autorizado pero no capturado
  | 'in_process'     // Pago en proceso de revisión
  | 'in_mediation'   // Pago en mediación
  | 'rejected'       // Pago rechazado
  | 'cancelled'      // Pago cancelado
  | 'refunded'       // Pago reembolsado
  | 'charged_back';  // Contracargo

// Métodos de pago locales
export type LocalPaymentMethod = 'transferencia' | 'efectivo';

// Estado general del resultado
export type CheckoutResultStatus = 
  | MercadoPagoStatus 
  | LocalPaymentMethod 
  | 'processing' 
  | 'error';

// Información del resultado del checkout
export interface ICheckoutResult {
  status: CheckoutResultStatus;
  id_venta?: string | number;
  metodo_pago?: string;
  mensaje?: string;
  // Para transferencia/efectivo
  datos_bancarios?: IBankDetails;
}

// Datos bancarios para transferencia
export interface IBankDetails {
  banco: string;
  tipo_cuenta: string;
  numero_cuenta: string;
  cbu?: string;
  alias?: string;
  titular: string;
  cuit?: string;
  // Mensaje adicional
  instrucciones?: string;
}

// Configuración de mensajes por estado
export interface IResultConfig {
  titulo: string;
  mensaje: string;
  icono: string;
  color: 'success' | 'warning' | 'error' | 'info';
  mostrarDatosBancarios?: boolean;
  acciones: IResultAction[];
}

// Acciones disponibles en el resultado
export interface IResultAction {
  label: string;
  variant: 'primary' | 'secondary' | 'outline-primary' | 'outline-secondary';
  href?: string;
  onClick?: () => void;
}

