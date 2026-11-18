'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, Plus, RefreshCw, TicketPercent, History } from 'lucide-react';
import { toast } from 'sonner';
import { AdminPageHeader } from '@/app/components/Admin/AdminPageHeader';
import { AdminPageContainer } from '@/app/components/Admin/AdminPageContainer';
import { Button } from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import SimpleModal from '@/app/components/modals/SimpleModal';
import { cuponesService } from '@/app/services/cupones.service';
import type { ICupon, ICuponCanje, CuponTipo } from '@/app/types/cupones.type';
import { formatCurrencyARS } from '@/app/utils/currency';
import { Switch } from '@/app/components/ui/Switch';

function normalizeCodigo(str: string) {
  return String(str || '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '');
}

function toDatetimeLocal(value: string | Date | null | undefined): string {
  if (!value) return '';
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatDate(value: string | Date | null | undefined): string {
  if (!value) return '—';
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('es-AR');
}

type FormState = {
  codigo: string;
  tipo: CuponTipo;
  valor: string;
  monto_minimo: string;
  usos_maximos: string;
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;
};

const emptyForm = (): FormState => ({
  codigo: '',
  tipo: 'porcentaje',
  valor: '',
  monto_minimo: '0',
  usos_maximos: '1',
  fecha_inicio: '',
  fecha_fin: '',
  activo: true,
});

export function CuponesPageClient() {
  const [rows, setRows] = useState<ICupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ICupon | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());

  const [canjesOpen, setCanjesOpen] = useState(false);
  const [canjesCupon, setCanjesCupon] = useState<ICupon | null>(null);
  const [canjes, setCanjes] = useState<ICuponCanje[]>([]);
  const [canjesLoading, setCanjesLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await cuponesService.list();
      setRows(data);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'No se pudieron cargar los cupones');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setModalOpen(true);
  };

  const openEdit = (cupon: ICupon) => {
    setEditing(cupon);
    setForm({
      codigo: cupon.codigo,
      tipo: cupon.tipo,
      valor: String(cupon.valor),
      monto_minimo: String(cupon.monto_minimo),
      usos_maximos: String(cupon.usos_maximos),
      fecha_inicio: toDatetimeLocal(cupon.fecha_inicio),
      fecha_fin: toDatetimeLocal(cupon.fecha_fin),
      activo: cupon.activo,
    });
    setModalOpen(true);
  };

  const openCanjes = async (cupon: ICupon) => {
    setCanjesCupon(cupon);
    setCanjesOpen(true);
    setCanjesLoading(true);
    try {
      const data = await cuponesService.listCanjes(cupon.id_cupon);
      setCanjes(data);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'No se pudieron cargar los usos');
      setCanjes([]);
    } finally {
      setCanjesLoading(false);
    }
  };

  const submit = async (close: () => void) => {
    const codigo = normalizeCodigo(form.codigo);
    const valor = parseFloat(form.valor);
    const monto_minimo = parseFloat(form.monto_minimo);
    const usos_maximos = parseInt(form.usos_maximos, 10);

    if (!codigo) {
      toast.error('El código es obligatorio');
      return;
    }
    if (!Number.isFinite(valor) || valor < 0) {
      toast.error('El valor debe ser un número >= 0');
      return;
    }
    if (form.tipo === 'porcentaje' && valor > 100) {
      toast.error('El porcentaje no puede ser mayor a 100');
      return;
    }
    if (!Number.isFinite(monto_minimo) || monto_minimo < 0) {
      toast.error('Monto mínimo inválido');
      return;
    }
    if (!Number.isFinite(usos_maximos) || usos_maximos < 1) {
      toast.error('Usos máximos debe ser al menos 1');
      return;
    }
    if (editing && usos_maximos < editing.usos_actuales) {
      toast.error('Usos máximos no puede ser menor que los usos actuales');
      return;
    }

    const payload = {
      codigo,
      tipo: form.tipo,
      valor,
      monto_minimo,
      usos_maximos,
      fecha_inicio: form.fecha_inicio || null,
      fecha_fin: form.fecha_fin || null,
      activo: form.activo,
    };

    setSaving(true);
    try {
      if (editing) {
        await cuponesService.update(editing.id_cupon, payload);
        toast.success('Cupón actualizado');
      } else {
        await cuponesService.create(payload);
        toast.success('Cupón creado');
      }
      close();
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'No se pudo guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (cupon: ICupon) => {
    try {
      await cuponesService.toggle(cupon.id_cupon);
      toast.success(cupon.activo ? 'Cupón desactivado' : 'Cupón activado');
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'No se pudo cambiar el estado');
    }
  };

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Cupones"
        description="Códigos promocionales de porcentaje o monto fijo para el checkout."
      />

      <div className="flex flex-wrap gap-3 mb-6">
        <Button variant="primary" onClick={openCreate} className="rounded-lg">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo cupón
        </Button>
        <Button variant="outline-primary" onClick={() => void load()} className="rounded-lg">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          <span className="ml-2">Actualizar</span>
        </Button>
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: 'var(--white)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-16 text-foreground/60">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Cargando cupones...
          </div>
        ) : rows.length === 0 ? (
          <div className="py-16 text-center text-foreground/60">
            <TicketPercent className="w-10 h-10 mx-auto mb-3 opacity-40" />
            Todavía no hay cupones. Creá el primero.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-foreground/10 text-left text-foreground/60">
                  <th className="px-4 py-3 font-medium">Código</th>
                  <th className="px-4 py-3 font-medium">Tipo</th>
                  <th className="px-4 py-3 font-medium">Valor</th>
                  <th className="px-4 py-3 font-medium">Mínimo</th>
                  <th className="px-4 py-3 font-medium">Usos</th>
                  <th className="px-4 py-3 font-medium">Vigencia</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.id_cupon} className="border-b border-foreground/5 hover:bg-foreground/[0.02]">
                    <td className="px-4 py-3 font-mono font-semibold">{c.codigo}</td>
                    <td className="px-4 py-3">
                      {c.tipo === 'porcentaje' ? 'Porcentaje' : 'Monto fijo'}
                    </td>
                    <td className="px-4 py-3">
                      {c.tipo === 'porcentaje'
                        ? `${c.valor}%`
                        : formatCurrencyARS(c.valor)}
                    </td>
                    <td className="px-4 py-3">{formatCurrencyARS(c.monto_minimo)}</td>
                    <td className="px-4 py-3">
                      <span className="font-medium">
                        {c.usos_actuales} / {c.usos_maximos}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-foreground/70">
                      <div>Desde: {formatDate(c.fecha_inicio)}</div>
                      <div>Hasta: {formatDate(c.fecha_fin)}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                          c.activo
                            ? 'bg-green-100 text-green-800'
                            : 'bg-foreground/10 text-foreground/60'
                        }`}
                      >
                        {c.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="rounded-md"
                          onClick={() => openEdit(c)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="rounded-md"
                          onClick={() => void openCanjes(c)}
                        >
                          <History className="w-3.5 h-3.5 mr-1" />
                          Ver usos
                        </Button>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="rounded-md"
                          onClick={() => void handleToggle(c)}
                        >
                          {c.activo ? 'Desactivar' : 'Activar'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <SimpleModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar cupón' : 'Nuevo cupón'}
        maxWidth="max-w-lg"
        actions={(close) => (
          <>
            <Button variant="outline-primary" onClick={close} className="rounded-lg flex-1">
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={() => void submit(close)}
              disabled={saving}
              className="rounded-lg flex-1"
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </Button>
          </>
        )}
      >
        <div className="space-y-4">
          {!editing && (
            <p className="text-sm text-foreground/60">
              El código se guarda en mayúsculas y sin espacios.
            </p>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Código *</label>
            <Input
              value={form.codigo}
              onChange={(e) => setForm((f) => ({ ...f, codigo: e.target.value }))}
              placeholder="BIENVENIDO10"
              className="font-mono uppercase"
              disabled={!!editing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tipo *</label>
            <select
              value={form.tipo}
              onChange={(e) =>
                setForm((f) => ({ ...f, tipo: e.target.value as CuponTipo }))
              }
              className="w-full border border-foreground/20 rounded-lg px-3 py-2 bg-white"
            >
              <option value="porcentaje">Porcentaje</option>
              <option value="monto_fijo">Monto fijo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              {form.tipo === 'porcentaje' ? 'Porcentaje (0-100) *' : 'Monto fijo ($) *'}
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={form.valor}
              onChange={(e) => setForm((f) => ({ ...f, valor: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Monto mínimo del carrito *</label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={form.monto_minimo}
              onChange={(e) => setForm((f) => ({ ...f, monto_minimo: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Usos máximos *</label>
            <Input
              type="number"
              min="1"
              value={form.usos_maximos}
              onChange={(e) => setForm((f) => ({ ...f, usos_maximos: e.target.value }))}
            />
            {editing && (
              <p className="text-xs text-foreground/50 mt-1">
                Usos actuales: {editing.usos_actuales}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Vigencia desde</label>
              <Input
                type="datetime-local"
                value={form.fecha_inicio}
                onChange={(e) => setForm((f) => ({ ...f, fecha_inicio: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Vigencia hasta</label>
              <Input
                type="datetime-local"
                value={form.fecha_fin}
                onChange={(e) => setForm((f) => ({ ...f, fecha_fin: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Activo</span>
            <Switch
              checked={form.activo}
              onCheckedChange={(checked) => setForm((f) => ({ ...f, activo: checked }))}
            />
          </div>
        </div>
      </SimpleModal>

      <SimpleModal
        isOpen={canjesOpen}
        onClose={() => setCanjesOpen(false)}
        title={canjesCupon ? `Usos de ${canjesCupon.codigo}` : 'Usos del cupón'}
        maxWidth="max-w-2xl"
        actions={(close) => (
          <Button variant="outline-primary" onClick={close} className="rounded-lg w-full">
            Cerrar
          </Button>
        )}
      >
        {canjesCupon && (
          <p className="text-sm text-foreground/60 mb-4">
            Contador: {canjesCupon.usos_actuales} / {canjesCupon.usos_maximos} (solo canjes
            aplicados)
          </p>
        )}
        {canjesLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : canjes.length === 0 ? (
          <p className="text-sm text-foreground/60 text-center py-8">Sin usos registrados.</p>
        ) : (
          <div className="overflow-x-auto max-h-80">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-foreground/10 text-left text-foreground/60">
                  <th className="px-2 py-2">Fecha</th>
                  <th className="px-2 py-2">Venta</th>
                  <th className="px-2 py-2">Monto</th>
                  <th className="px-2 py-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {canjes.map((r) => (
                  <tr key={r.id_canje} className="border-b border-foreground/5">
                    <td className="px-2 py-2 text-xs">{formatDate(r.creado_en)}</td>
                    <td className="px-2 py-2 font-mono text-xs">
                      {r.cod_interno || `#${r.id_venta}`}
                    </td>
                    <td className="px-2 py-2">{formatCurrencyARS(r.monto_aplicado)}</td>
                    <td className="px-2 py-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          r.estado === 'aplicado'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {r.estado === 'aplicado' ? 'Aplicado' : 'Liberado'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SimpleModal>
    </AdminPageContainer>
  );
}
