import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import type { IConfigTienda, IDatosBancarios } from '@/app/types/config-tienda.type';
import type { UseMutationResult } from '@tanstack/react-query';

type Mutation = UseMutationResult<{ data: IConfigTienda }, Error, Partial<IConfigTienda>>;

const emptyBank: IDatosBancarios = {
  banco: '',
  tipo_cuenta: '',
  numero_cuenta: '',
  cbu: '',
  alias: '',
  titular: '',
  cuit: '',
  instrucciones: '',
};

function toFormState(db: IDatosBancarios | null | undefined): IDatosBancarios {
  if (!db) return { ...emptyBank };
  return {
    banco: db.banco ?? '',
    tipo_cuenta: db.tipo_cuenta ?? '',
    numero_cuenta: db.numero_cuenta ?? '',
    cbu: db.cbu ?? '',
    alias: db.alias ?? '',
    titular: db.titular ?? '',
    cuit: db.cuit ?? '',
    instrucciones: db.instrucciones ?? '',
  };
}

function isEqual(a: IDatosBancarios, b: IDatosBancarios): boolean {
  return (
    a.banco === b.banco &&
    a.tipo_cuenta === b.tipo_cuenta &&
    a.numero_cuenta === b.numero_cuenta &&
    (a.cbu ?? '') === (b.cbu ?? '') &&
    (a.alias ?? '') === (b.alias ?? '') &&
    a.titular === b.titular &&
    (a.cuit ?? '') === (b.cuit ?? '') &&
    (a.instrucciones ?? '') === (b.instrucciones ?? '')
  );
}

export function useDatosBancariosConfig(config: IConfigTienda | undefined, mutation: Mutation) {
  const [form, setForm] = useState<IDatosBancarios>(() => toFormState(config?.datos_bancarios));

  useEffect(() => {
    setForm(toFormState(config?.datos_bancarios));
  }, [config?.datos_bancarios]);

  const serverBank = config?.datos_bancarios ?? null;
  const serverForm = toFormState(serverBank);
  const hasChanges = config != null && !isEqual(form, serverForm);

  const update = (field: keyof IDatosBancarios, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const payload: Partial<IDatosBancarios> = {
      banco: form.banco.trim() || undefined,
      tipo_cuenta: form.tipo_cuenta.trim() || undefined,
      numero_cuenta: form.numero_cuenta.trim() || undefined,
      cbu: form.cbu?.trim() || undefined,
      alias: form.alias?.trim() || undefined,
      titular: form.titular.trim() || undefined,
      cuit: form.cuit?.trim() || undefined,
      instrucciones: form.instrucciones?.trim() || undefined,
    };
    const isEmpty = !payload.banco && !payload.numero_cuenta && !payload.titular;
    try {
      await mutation.mutateAsync({
        datos_bancarios: isEmpty ? null : payload,
      });
      toast.success('Datos bancarios guardados. Se mostrarán en el resultado del pedido y en el email.');
    } catch {
      toast.error('Error al guardar los datos bancarios');
    }
  };

  return { form, update, hasChanges, handleSave };
}
