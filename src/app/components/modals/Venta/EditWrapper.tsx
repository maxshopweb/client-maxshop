'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import SimpleModal from '@/app/components/modals/SimpleModal';
import Select from '@/app/components/ui/Select';
import Textarea from '@/app/components/ui/Textarea';
import Input from '@/app/components/ui/Input';
import Link from 'next/link';
import { FileText, CreditCard, User, ExternalLink, Phone, Home, MapPin, Package } from 'lucide-react';
import {
    updateVentaSchema,
    type UpdateVentaData
} from '@/app/schemas/venta.schema';
import { useUpdateEnvio, useUpdateVenta } from '@/app/hooks/ventas/useVentasMutations';
import { useUpdateCliente } from '@/app/hooks/clientes/useClientes';
import type { IVenta } from '@/app/types/ventas.type';
import type { IUpdateClienteDTO } from '@/app/types/cliente.type';
import { ESTADO_PAGO_OPTIONS, METODO_PAGO_OPTIONS, TIPO_VENTA_OPTIONS } from '@/app/types/ventas.type';
import { Button } from '@/app/components/ui/Button';
import { getNumeroPedidoDisplay } from '@/app/utils/venta.utils';
import {
    hasDireccionCompletaParaEnvio,
    isVentaRetiroEnTienda,
} from '@/app/utils/venta-envio.validation';
import { toast } from 'sonner';

type FormData = UpdateVentaData & IUpdateClienteDTO;

const STEPS = [
    { id: 1, label: 'Estado y pago', icon: CreditCard },
    { id: 2, label: 'Datos', icon: User },
] as const;

type StepId = (typeof STEPS)[number]['id'];

interface EditVentaModalProps {
    venta: IVenta;
    onClose: () => void;
}

export function EditVentaModal({ venta, onClose }: EditVentaModalProps) {
    const [step, setStep] = useState<StepId>(1);
    const [empresaEnvio, setEmpresaEnvio] = useState(venta.envio?.empresa_envio || 'andreani');
    const [codigoSeguimiento, setCodigoSeguimiento] = useState(venta.envio?.cod_seguimiento || '');
    const c = venta.cliente;

    const form = useForm<FormData>({
        resolver: zodResolver(updateVentaSchema),
        mode: 'onChange',
        defaultValues: {
            estado_pago: (venta.estado_pago ?? undefined) as UpdateVentaData['estado_pago'],
            estado_envio: (venta.estado_envio ?? undefined) as UpdateVentaData['estado_envio'],
            metodo_pago: (venta.metodo_pago ?? undefined) as UpdateVentaData['metodo_pago'],
            observaciones: venta.observaciones ?? undefined,
            telefono: c?.usuario?.telefono ?? '',
            direccion: c?.direccion ?? '',
            altura: c?.altura ?? '',
            piso: c?.piso ?? '',
            dpto: c?.dpto ?? '',
            ciudad: c?.ciudad ?? '',
            provincia: c?.provincia ?? '',
            cod_postal: c?.cod_postal ?? undefined,
        },
    });

    const { updateVentaAsync, isUpdating: isUpdatingVenta } = useUpdateVenta({
        onError: (error) => {
            console.error('❌ Error al actualizar venta:', error);
        }
    });
    const { updateEnvioAsync, isUpdating: isUpdatingEnvio } = useUpdateEnvio();
    const { updateClienteAsync, isUpdating: isUpdatingCliente } = useUpdateCliente();
    const isUpdating = isUpdatingVenta || isUpdatingCliente || isUpdatingEnvio;

    const observacionesWatch = form.watch('observaciones');
    const direccionWatch = form.watch('direccion');
    const ciudadWatch = form.watch('ciudad');
    const codPostalWatch = form.watch('cod_postal');
    const obsParaEnvio =
        (typeof observacionesWatch === 'string' ? observacionesWatch : '') ||
        venta.observaciones ||
        '';
    const esRetiro = isVentaRetiroEnTienda(obsParaEnvio);
    const direccionOk = hasDireccionCompletaParaEnvio({
        direccion: direccionWatch,
        ciudad: ciudadWatch,
        cod_postal: codPostalWatch,
    });
    const requiereDireccionParaEnvio = !esRetiro;
    const bloqueadoPorDireccion = requiereDireccionParaEnvio && !direccionOk;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const valid = await form.trigger(['estado_pago', 'metodo_pago', 'observaciones']);
        if (!valid) return;

        const data = form.getValues();
        const obs = data.observaciones ?? venta.observaciones ?? '';
        const retiro = isVentaRetiroEnTienda(obs);
        const confirmaPago =
            data.estado_pago === 'aprobado' && venta.estado_pago !== 'aprobado';

        if (confirmaPago && !retiro && !hasDireccionCompletaParaEnvio(data)) {
            toast.error(
                'Completá calle, ciudad y código postal del cliente (paso Datos) antes de aprobar el pago, o indicá retiro en tienda en observaciones.'
            );
            return;
        }

        const ventaPayload: UpdateVentaData = {
            estado_pago: data.estado_pago,
            metodo_pago: data.metodo_pago,
            observaciones: data.observaciones,
        };
        if (venta.id_envio) delete (ventaPayload as any).estado_envio;
        else ventaPayload.estado_envio = data.estado_envio;

        try {
            if (c?.id_usuario) {
                const clientePayload: IUpdateClienteDTO = {
                    telefono: data.telefono || null,
                    direccion: data.direccion || null,
                    altura: data.altura || null,
                    piso: data.piso || null,
                    dpto: data.dpto || null,
                    ciudad: data.ciudad || null,
                    provincia: data.provincia || null,
                    cod_postal: data.cod_postal ?? null,
                };
                await updateClienteAsync({ id: c.id_usuario, data: clientePayload });
            }
            await updateVentaAsync({ id: venta.id_venta, data: ventaPayload });
            form.reset();
            onClose();
        } catch {
            // toasts ya los muestran los hooks
        }
    };

    const handleGuardarSeguimiento = async () => {
        const empresa = empresaEnvio.trim();
        const tracking = codigoSeguimiento.trim();
        if (!empresa && !tracking) return;

        const data = form.getValues();
        const obs = data.observaciones ?? venta.observaciones ?? '';
        if (!isVentaRetiroEnTienda(obs) && !hasDireccionCompletaParaEnvio(data)) {
            toast.error(
                'Completá la dirección del cliente (paso Datos) para cargar seguimiento, salvo que sea retiro en tienda (indicalo en observaciones).'
            );
            return;
        }

        await updateEnvioAsync({
            id: venta.id_venta,
            data: {
                empresa_envio: empresa || null,
                cod_seguimiento: tracking || null,
            },
        });
    };

    return (
        <SimpleModal
            isOpen={true}
            onClose={onClose}
            title={
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <span>Editar venta {getNumeroPedidoDisplay(venta.cod_interno, venta.id_venta) ?? `#${venta.id_venta}`}</span>
                    {venta.cliente?.id_usuario && (
                        <Link
                            href={`/admin/clientes/${venta.cliente.id_usuario}?edit=1`}
                            onClick={onClose}
                            className="text-sm font-normal text-principal hover:underline flex items-center gap-1.5"
                        >
                            Ver ficha del cliente
                            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        </Link>
                    )}
                </div>
            }
            maxWidth="max-w-4xl"
            actions={(handleClose) => (
                <>
                    <Button
                        onClick={handleClose}
                        variant="secondary"
                        disabled={isUpdating}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="primary"
                        disabled={isUpdating}
                    >
                        {isUpdating ? 'Guardando...' : 'Guardar cambios'}
                    </Button>
                </>
            )}
        >
            {/* Tabs de pasos */}
            <div className="flex gap-1 p-1 rounded-lg bg-muted/50 border border-input mb-6">
                {STEPS.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => setStep(id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-md text-sm font-medium transition-colors ${
                            step === id
                                ? 'bg-background text-foreground shadow-sm border border-input'
                                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                        }`}
                    >
                        <Icon className="w-4 h-4 shrink-0" />
                        {label}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col min-h-0">
                {step === 1 && (
                    <div className="space-y-4">
                        <div>
                            <Select
                                label="Estado de pago"
                                options={[
                                    { value: '', label: 'Seleccionar estado' },
                                    ...ESTADO_PAGO_OPTIONS.map(opt => ({
                                        value: opt.value,
                                        label: opt.label,
                                    }))
                                ]}
                                value={form.watch('estado_pago') || ''}
                                onChange={(value) => form.setValue('estado_pago', value as any)}
                                error={form.formState.errors.estado_pago?.message}
                            />
                        </div>
                        <div>
                            <Select
                                label="Método de pago"
                                options={[
                                    { value: '', label: 'Seleccionar método' },
                                    ...METODO_PAGO_OPTIONS.map(opt => ({
                                        value: opt.value,
                                        label: opt.label,
                                    }))
                                ]}
                                value={form.watch('metodo_pago') || ''}
                                onChange={(value) => form.setValue('metodo_pago', value as any)}
                                error={form.formState.errors.metodo_pago?.message}
                            />
                        </div>
                        {!esRetiro && (
                            <div className="space-y-3 rounded-lg border border-input bg-muted/20 p-4">
                                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                    <Package className="w-4 h-4" />
                                    Seguimiento de envío (manual)
                                </h4>
                                {bloqueadoPorDireccion && (
                                    <p className="text-sm text-amber-700 dark:text-amber-400">
                                        Completá calle, ciudad y CP del cliente en el paso Datos para poder cargar seguimiento (no aplica si el pedido es retiro en tienda: indicarlo en observaciones).
                                    </p>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <Input
                                        label="Empresa de envío"
                                        placeholder="Ej: Andreani"
                                        className="bg-background"
                                        value={empresaEnvio}
                                        onChange={(e) => setEmpresaEnvio(e.target.value)}
                                    />
                                    <Input
                                        label="Código de seguimiento"
                                        placeholder="Ej: 360000102000579"
                                        className="bg-background"
                                        value={codigoSeguimiento}
                                        onChange={(e) => setCodigoSeguimiento(e.target.value)}
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        type="button"
                                        variant="outline-primary"
                                        disabled={
                                            isUpdating ||
                                            (!empresaEnvio.trim() && !codigoSeguimiento.trim()) ||
                                            bloqueadoPorDireccion
                                        }
                                        onClick={() => void handleGuardarSeguimiento()}
                                    >
                                        Guardar seguimiento
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {step === 2 && (
                    <div className="overflow-y-auto max-h-[min(70vh,600px)] pr-1">
                        <p className="text-sm text-muted-foreground mb-3">
                            Editá los datos del cliente y las observaciones. Al guardar se actualizan primero el cliente y luego la venta. Para envío a domicilio, calle, ciudad y código postal son obligatorios antes de aprobar el pago; si es retiro en tienda, indicarlo en observaciones.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Col 1: Contacto (editable) + Tipo (solo lectura) */}
                            <div className="space-y-4">
                                <div className="space-y-3 rounded-lg border border-input bg-muted/20 p-4">
                                    <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        Contacto
                                    </h4>
                                    <Input
                                        label="Teléfono"
                                        icon={Phone}
                                        iconPosition="left"
                                        placeholder="Ej. 11 1234-5678"
                                        className="bg-background"
                                        {...form.register('telefono')}
                                    />
                                    {venta.cliente?.usuario && (
                                        <p className="text-xs text-muted-foreground">
                                            Cliente: {venta.cliente.usuario.nombre} {venta.cliente.usuario.apellido}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-3 rounded-lg border border-input bg-muted/20 p-4">
                                    <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                        <Package className="w-4 h-4" />
                                        Tipo
                                    </h4>
                                    <Input
                                        label="Tipo de venta"
                                        readOnly
                                        value={TIPO_VENTA_OPTIONS.find(o => o.value === ((venta.tipo_venta as string | null | undefined) === 'telefono' ? 'otro' : venta.tipo_venta))?.label || venta.tipo_venta || '-'}
                                        className="bg-background"
                                    />
                                    <Input
                                        label="Método de pago"
                                        readOnly
                                        value={METODO_PAGO_OPTIONS.find(o => o.value === venta.metodo_pago)?.label || venta.metodo_pago || '-'}
                                        className="bg-background"
                                    />
                                </div>
                            </div>
                            {/* Col 2: Dirección (editable) + Observaciones */}
                            <div className="space-y-4">
                                <div className="space-y-3 rounded-lg border border-input bg-muted/20 p-4">
                                    <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        Dirección
                                    </h4>
                                    <Input
                                        label="Calle"
                                        icon={Home}
                                        iconPosition="left"
                                        placeholder="Nombre de la calle"
                                        className="bg-background"
                                        {...form.register('direccion')}
                                    />
                                    <div className="grid grid-cols-3 gap-2">
                                        <Input label="Altura" placeholder="Nº" className="bg-background" {...form.register('altura')} />
                                        <Input label="Piso" placeholder="Piso" className="bg-background" {...form.register('piso')} />
                                        <Input label="Dpto" placeholder="Dpto" className="bg-background" {...form.register('dpto')} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Input label="Ciudad" placeholder="Ciudad" className="bg-background" {...form.register('ciudad')} />
                                        <Input label="Provincia" placeholder="Provincia" className="bg-background" {...form.register('provincia')} />
                                    </div>
                                    <Input
                                        label="Código postal"
                                        placeholder="CP"
                                        className="bg-background"
                                        {...form.register('cod_postal', { setValueAs: (v) => { if (v === '' || v == null) return undefined; const n = Number(v); return isNaN(n) ? undefined : n; } })}
                                    />
                                </div>
                                <div className="rounded-lg border border-input bg-muted/20 p-4">
                                    <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                                        <FileText className="w-4 h-4" />
                                        Observaciones
                                    </h4>
                                    <Textarea
                                        placeholder="Notas del pedido..."
                                        rows={3}
                                        {...form.register('observaciones')}
                                        error={form.formState.errors.observaciones?.message}
                                        className="bg-background"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </SimpleModal>
    );
}

