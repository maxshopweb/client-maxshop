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

/** Props compartidas por pantallas de estado del checkout */
export interface CheckoutStateDisplayProps {
  id_venta?: string | number;
  cod_interno?: string | null;
  /** payment_id de Mercado Pago (nº de operación en pasarela) */
  payment_id?: string | null;
  /** Mensaje custom cuando el estado se infiere (ej. URL sin status válido) */
  mensaje?: string | null;
}

// Información del resultado del checkout
export interface ICheckoutResult extends CheckoutStateDisplayProps {
  status: CheckoutResultStatus;
  metodo_pago?: string;
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

