import { IProductos } from './producto.type';

// Item del carrito
export interface ICartItem {
  id_prod: number;
  producto: IProductos;
  cantidad: number;
  precio_unitario: number;
  descuento?: number;
  subtotal: number;
}

// Resumen del carrito
export interface ICartSummary {
  subtotal: number;
  descuentos: number;
  envio: number;
  total: number;
  cantidadItems: number;
}

// Tipo de envío
export type TipoEnvio = 'envio' | 'retiro';

// Datos de envío
export interface IDatosEnvio {
  tipo: TipoEnvio;
  // Datos para envío
  calle?: string;
  numero?: string;
  piso?: string;
  departamento?: string;
  codigo_postal?: string;
  ciudad?: string;
  provincia?: string;
  telefono?: string;
  // Datos para retiro
  sucursal?: string;
  fecha_retiro?: string;
  horario_retiro?: string;
}

// Tipo de facturación
export type TipoFacturacion = 'consumidor_final' | 'responsable_inscripto' | 'exento';

// Datos de facturación
export interface IDatosFacturacion {
  tipo: TipoFacturacion;
  nombre_completo: string;
  dni?: string;
  cuit?: string;
  email: string;
  telefono: string;
  direccion?: string;
  ciudad?: string;
  provincia?: string;
  codigo_postal?: string;
}

// Método de pago
export type MetodoPago = 'efectivo' | 'transferencia' | 'credito' | 'debito';

// Datos de pago
export interface IDatosPago {
  metodo: MetodoPago;
  // Para transferencia
  comprobante?: File | null;
  // Para crédito/débito (futuro - pasarela de pago)
  tarjeta?: {
    numero?: string;
    nombre?: string;
    vencimiento?: string;
    cvv?: string;
  };
}

// Estado completo del checkout
export interface ICheckoutState {
  step: 1 | 2 | 3;
  items: ICartItem[];
  datosEnvio: IDatosEnvio | null;
  datosFacturacion: IDatosFacturacion | null;
  datosPago: IDatosPago | null;
}

// Configuración de campos del formulario (para poder cambiarlos fácilmente)
export interface IFormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'select' | 'date' | 'time' | 'file';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
    message?: string;
  };
}

// Configuración de formularios
export interface IFormConfig {
  envio: IFormFieldConfig[];
  facturacion: IFormFieldConfig[];
  pago: IFormFieldConfig[];
}

