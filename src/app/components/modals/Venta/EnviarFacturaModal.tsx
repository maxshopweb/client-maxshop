'use client';

import { useCallback, useRef, useState } from 'react';
import { FileText, Mail, Upload } from 'lucide-react';
import { toast } from 'sonner';
import SimpleModal from '@/app/components/modals/SimpleModal';
import { Button } from '@/app/components/ui/Button';
import type { IVenta } from '@/app/types/ventas.type';
import { getNumeroPedidoDisplay } from '@/app/utils/venta.utils';
import { facturasService } from '@/app/services/facturas.service';

interface EnviarFacturaModalProps {
    venta: IVenta;
    onClose: () => void;
    onSuccess?: () => void;
}

function getClienteEmail(venta: IVenta): string | null {
    return venta.cliente?.usuario?.email || venta.usuario?.email || null;
}

function getClienteNombre(venta: IVenta): string {
    const nombre = venta.cliente?.usuario?.nombre || venta.usuario?.nombre || '';
    const apellido = venta.cliente?.usuario?.apellido || venta.usuario?.apellido || '';
    return `${nombre} ${apellido}`.trim() || 'Cliente';
}

export function EnviarFacturaModal({ venta, onClose, onSuccess }: EnviarFacturaModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isSending, setIsSending] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const clienteEmail = getClienteEmail(venta);
    const numeroPedido = getNumeroPedidoDisplay(venta.cod_interno, venta.id_venta) ?? `#${venta.id_venta}`;

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0] ?? null;
        if (selected && selected.type !== 'application/pdf' && !selected.name.toLowerCase().endsWith('.pdf')) {
            toast.error('Solo se permiten archivos PDF');
            e.target.value = '';
            setFile(null);
            return;
        }
        setFile(selected);
    }, []);

    const handleSubmit = useCallback(async () => {
        if (!file) {
            toast.error('Seleccioná un archivo PDF');
            return;
        }
        if (!clienteEmail) {
            toast.error('La venta no tiene email de cliente');
            return;
        }

        setIsSending(true);
        try {
            await facturasService.enviarFacturaManual(venta.id_venta, file);
            toast.success('Factura enviada', {
                description: `Se envió a ${clienteEmail}`,
            });
            onSuccess?.();
            onClose();
        } catch (e) {
            toast.error('No se pudo enviar la factura', {
                description: e instanceof Error ? e.message : 'Error desconocido',
            });
        } finally {
            setIsSending(false);
        }
    }, [file, clienteEmail, venta.id_venta, onClose, onSuccess]);

    return (
        <SimpleModal
            isOpen={true}
            onClose={onClose}
            maxWidth="max-w-md"
            title={
                <span className="flex items-center gap-2">
                    <span className="shrink-0 w-9 h-9 rounded-full bg-principal/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-principal" />
                    </span>
                    Enviar factura
                </span>
            }
            actions={(handleClose) => (
                <>
                    <Button type="button" onClick={handleClose} variant="ghost" disabled={isSending}>
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        variant="primary"
                        disabled={isSending || !file || !clienteEmail}
                    >
                        {isSending ? 'Enviando...' : 'Enviar factura'}
                    </Button>
                </>
            )}
        >
            <div className="space-y-4">
                <p className="text-sm text-foreground/80">
                    Pedido <span className="font-semibold">{numeroPedido}</span>
                    {' · '}
                    Cliente: <span className="font-medium">{getClienteNombre(venta)}</span>
                </p>

                <div className="rounded-lg border border-input p-3 bg-background">
                    <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-foreground/50 shrink-0" />
                        {clienteEmail ? (
                            <span>
                                <span className="text-foreground/60">Destinatario: </span>
                                <span className="font-medium text-foreground break-all">{clienteEmail}</span>
                            </span>
                        ) : (
                            <span className="text-red-600">Sin email de cliente — no se puede enviar</span>
                        )}
                    </div>
                </div>

                <div>
                    <input
                        ref={inputRef}
                        type="file"
                        accept=".pdf,application/pdf"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        disabled={isSending}
                        className="w-full flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-input hover:border-principal/50 hover:bg-principal/5 p-6 transition-colors disabled:opacity-50"
                    >
                        <Upload className="w-8 h-8 text-foreground/40" />
                        {file ? (
                            <span className="text-sm font-medium text-foreground break-all text-center">{file.name}</span>
                        ) : (
                            <>
                                <span className="text-sm font-medium text-foreground">Seleccionar PDF de factura</span>
                                <span className="text-xs text-foreground/50">Máximo 15 MB</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </SimpleModal>
    );
}
