import { IFormConfig } from '../types/cart.type';

export const cartFormsConfig: IFormConfig = {
  envio: [
    {
      name: 'tipo',
      label: 'Tipo de entrega',
      type: 'select',
      required: true,
      options: [
        { value: 'envio', label: 'Envío a domicilio' },
        { value: 'retiro', label: 'Retiro en sucursal' },
      ],
    },
    // Campos para envío
    {
      name: 'calle',
      label: 'Calle',
      type: 'text',
      placeholder: 'Nombre de la calle',
      required: true,
    },
    {
      name: 'numero',
      label: 'Número',
      type: 'text',
      placeholder: '123',
      required: true,
    },
    {
      name: 'piso',
      label: 'Piso',
      type: 'text',
      placeholder: 'Opcional',
      required: false,
    },
    {
      name: 'departamento',
      label: 'Departamento',
      type: 'text',
      placeholder: 'Opcional',
      required: false,
    },
    {
      name: 'codigo_postal',
      label: 'Código Postal',
      type: 'text',
      placeholder: '1234',
      required: true,
      validation: {
        pattern: '^[0-9]{4}$',
        message: 'El código postal debe tener 4 dígitos',
      },
    },
    {
      name: 'ciudad',
      label: 'Ciudad',
      type: 'text',
      placeholder: 'Nombre de la ciudad',
      required: true,
    },
    {
      name: 'provincia',
      label: 'Provincia',
      type: 'text',
      placeholder: 'Nombre de la provincia',
      required: true,
    },
    {
      name: 'telefono',
      label: 'Teléfono de contacto',
      type: 'tel',
      placeholder: '+54 11 1234-5678',
      required: true,
    },
    // Campos para retiro
    {
      name: 'sucursal',
      label: 'Sucursal',
      type: 'select',
      placeholder: 'Seleccione una sucursal',
      required: false,
      options: [
        { value: 'sucursal1', label: 'Sucursal Centro' },
        { value: 'sucursal2', label: 'Sucursal Norte' },
        { value: 'sucursal3', label: 'Sucursal Sur' },
      ],
    },
    {
      name: 'fecha_retiro',
      label: 'Fecha de retiro',
      type: 'date',
      required: false,
    },
    {
      name: 'horario_retiro',
      label: 'Horario de retiro',
      type: 'time',
      required: false,
    },
  ],
  facturacion: [
    {
      name: 'tipo',
      label: 'Tipo de facturación',
      type: 'select',
      required: true,
      options: [
        { value: 'consumidor_final', label: 'Consumidor Final' },
        { value: 'responsable_inscripto', label: 'Responsable Inscripto' },
        { value: 'exento', label: 'Exento' },
      ],
    },
    {
      name: 'nombre_completo',
      label: 'Nombre completo',
      type: 'text',
      placeholder: 'Juan Pérez',
      required: true,
    },
    {
      name: 'dni',
      label: 'DNI',
      type: 'text',
      placeholder: '12345678',
      required: false,
      validation: {
        pattern: '^[0-9]{7,8}$',
        message: 'El DNI debe tener entre 7 y 8 dígitos',
      },
    },
    {
      name: 'cuit',
      label: 'CUIT',
      type: 'text',
      placeholder: '20-12345678-9',
      required: false,
      validation: {
        pattern: '^[0-9]{2}-[0-9]{8}-[0-9]{1}$',
        message: 'El CUIT debe tener el formato XX-XXXXXXXX-X',
      },
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'email@ejemplo.com',
      required: true,
    },
    {
      name: 'telefono',
      label: 'Teléfono',
      type: 'tel',
      placeholder: '+54 11 1234-5678',
      required: true,
    },
    {
      name: 'direccion',
      label: 'Dirección',
      type: 'text',
      placeholder: 'Calle y número',
      required: false,
    },
    {
      name: 'ciudad',
      label: 'Ciudad',
      type: 'text',
      placeholder: 'Nombre de la ciudad',
      required: false,
    },
    {
      name: 'provincia',
      label: 'Provincia',
      type: 'text',
      placeholder: 'Nombre de la provincia',
      required: false,
    },
    {
      name: 'codigo_postal',
      label: 'Código Postal',
      type: 'text',
      placeholder: '1234',
      required: false,
    },
  ],
  pago: [
    {
      name: 'metodo',
      label: 'Método de pago',
      type: 'select',
      required: true,
      options: [
        { value: 'efectivo', label: 'Efectivo' },
        { value: 'transferencia', label: 'Transferencia bancaria' },
        { value: 'credito', label: 'Tarjeta de crédito' },
        { value: 'debito', label: 'Tarjeta de débito' },
      ],
    },
    {
      name: 'comprobante',
      label: 'Comprobante de transferencia',
      type: 'file',
      required: false,
    },
    // Campos para tarjeta (futuro - pasarela de pago)
    {
      name: 'numero_tarjeta',
      label: 'Número de tarjeta',
      type: 'text',
      placeholder: '1234 5678 9012 3456',
      required: false,
      validation: {
        pattern: '^[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}$',
        message: 'Formato inválido',
      },
    },
    {
      name: 'nombre_tarjeta',
      label: 'Nombre en la tarjeta',
      type: 'text',
      placeholder: 'JUAN PEREZ',
      required: false,
    },
    {
      name: 'vencimiento',
      label: 'Vencimiento',
      type: 'text',
      placeholder: 'MM/AA',
      required: false,
      validation: {
        pattern: '^(0[1-9]|1[0-2])/[0-9]{2}$',
        message: 'Formato inválido (MM/AA)',
      },
    },
    {
      name: 'cvv',
      label: 'CVV',
      type: 'text',
      placeholder: '123',
      required: false,
      validation: {
        pattern: '^[0-9]{3,4}$',
        message: 'CVV inválido',
      },
    },
  ],
};

