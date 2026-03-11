'use client';

import { useForm } from 'react-hook-form';
import SimpleModal from '@/app/components/modals/SimpleModal';
import Input from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';
import { Phone, Home, FileText } from 'lucide-react';
import { useUpdateCliente } from '@/app/hooks/clientes/useClientes';
import type { ICliente } from '@/app/types/cliente.type';
import type { IUpdateClienteDTO } from '@/app/types/cliente.type';

interface EditClienteModalProps {
    cliente: ICliente;
    onClose: () => void;
}

type FormData = IUpdateClienteDTO;

export function EditClienteModal({ cliente, onClose }: EditClienteModalProps) {
    const { updateClienteAsync, isUpdating } = useUpdateCliente({
        onSuccess: () => onClose(),
    });

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            telefono: cliente.usuario?.telefono ?? '',
            numero_documento: cliente.usuario?.numero_documento ?? '',
            tipo_documento: cliente.usuario?.tipo_documento ?? '',
            direccion: cliente.direccion ?? '',
            altura: cliente.altura ?? '',
            piso: cliente.piso ?? '',
            dpto: cliente.dpto ?? '',
            ciudad: cliente.ciudad ?? '',
            provincia: cliente.provincia ?? '',
            cod_postal: cliente.cod_postal ?? undefined,
            activo: cliente.usuario?.activo !== false,
        },
    });

    const onSubmit = (data: FormData) => {
        const payload: IUpdateClienteDTO = {
            telefono: data.telefono || null,
            numero_documento: data.numero_documento || null,
            tipo_documento: data.tipo_documento || null,
            direccion: data.direccion || null,
            altura: data.altura || null,
            piso: data.piso || null,
            dpto: data.dpto || null,
            ciudad: data.ciudad || null,
            provincia: data.provincia || null,
            cod_postal: data.cod_postal ?? null,
            activo: data.activo,
        };
        updateClienteAsync({ id: cliente.id_usuario, data: payload });
    };

    return (
        <SimpleModal
            isOpen={true}
            onClose={onClose}
            title="Editar datos del cliente"
            maxWidth="max-w-lg"
            actions={(handleClose) => (
                <>
                    <Button variant="secondary" onClick={handleClose} disabled={isUpdating}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleSubmit(onSubmit)} disabled={isUpdating}>
                        {isUpdating ? 'Guardando...' : 'Guardar'}
                    </Button>
                </>
            )}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="activo"
                        className="h-4 w-4 rounded border-input"
                        {...register('activo', { setValueAs: (v) => v === true || v === 'on' })}
                    />
                    <label htmlFor="activo" className="text-sm font-medium text-foreground">
                        Cuenta activa (puede iniciar sesión y realizar compras)
                    </label>
                </div>
                <Input
                    label="Teléfono"
                    icon={Phone}
                    iconPosition="left"
                    placeholder="Ej. 11 1234-5678"
                    {...register('telefono')}
                />
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Tipo documento</label>
                        <select
                            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                            {...register('tipo_documento')}
                        >
                            <option value="">-</option>
                            <option value="DNI">DNI</option>
                            <option value="CUIT">CUIT</option>
                            <option value="CUIL">CUIL</option>
                        </select>
                    </div>
                    <Input
                        label="Número (DNI/CUIT)"
                        icon={FileText}
                        iconPosition="left"
                        placeholder="Ej. 12345678"
                        {...register('numero_documento')}
                    />
                </div>
                <Input
                    label="Calle"
                    icon={Home}
                    iconPosition="left"
                    placeholder="Nombre de la calle"
                    {...register('direccion')}
                />
                <div className="grid grid-cols-3 gap-3">
                    <Input label="Número" placeholder="Ej. 123" {...register('altura')} />
                    <Input label="Piso" placeholder="Ej. 2" {...register('piso')} />
                    <Input label="Dpto" placeholder="Ej. A" {...register('dpto')} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <Input label="Ciudad" placeholder="Ciudad" {...register('ciudad')} />
                    <Input label="Provincia" placeholder="Provincia" {...register('provincia')} />
                </div>
                <Input
                    label="Código postal"
                    type="number"
                    placeholder="Ej. 1234"
                    {...register('cod_postal', { setValueAs: (v) => (v === '' ? undefined : Number(v)) })}
                />
            </form>
        </SimpleModal>
    );
}
