'use client';

import { useState, useCallback } from 'react';
import { UserPlus, RefreshCw, Loader2, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { AdminPageHeader } from '@/app/components/Admin/AdminPageHeader';
import { AdminPageContainer } from '@/app/components/Admin/AdminPageContainer';
import { Button } from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import SimpleModal from '@/app/components/modals/SimpleModal';
import ConfirmModal from '@/app/components/modals/ConfirmModal';
import { useAdminStaffFilters } from '@/app/hooks/admin-staff/useAdminStaffFilters';
import { useAdminStaffList } from '@/app/hooks/admin-staff/useAdminStaffList';
import { useAdminStaffMutations } from '@/app/hooks/admin-staff/useAdminStaffMutations';
import type { IStaffUser } from '@/app/types/admin-staff.type';
import { UsuariosStaffFilters } from './UsuariosStaffFilters';
import { UsuariosStaffTable } from './UsuariosStaffTable';
import { UsuariosStaffPaginacion } from './UsuariosStaffPaginacion';
import { CopyPasswordModal } from './CopyPasswordModal';
import {
  generateStaffPassword,
  getStaffEmailDomain,
  isValidStaffEmailLocalPart
} from '@/app/utils/generateStaffPassword';

export function UsuariosStaffPageClient() {
  const filterState = useAdminStaffFilters();
  const { filters, goToPage } = filterState;
  const listQuery = useAdminStaffList({ filters });
  const { data, isLoading, isFetching, isError, error, refetch } = listQuery;
  const { createStaff, resetPassword, setActive } = useAdminStaffMutations();

  const emailDomain = getStaffEmailDomain();

  const rows = data?.data ?? [];
  const total = data?.total ?? 0;
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;

  const [createOpen, setCreateOpen] = useState(false);
  const [createEmailLocal, setCreateEmailLocal] = useState('');
  const [createNombre, setCreateNombre] = useState('');
  const [createApellido, setCreateApellido] = useState('');
  const [createPassword, setCreatePassword] = useState('');

  const [confirmReset, setConfirmReset] = useState<IStaffUser | null>(null);
  const [confirmToggle, setConfirmToggle] = useState<{ user: IStaffUser; activo: boolean } | null>(
    null
  );

  const [passwordModal, setPasswordModal] = useState<{
    password: string;
    title: string;
    subtitle?: string;
  } | null>(null);

  const handleResetPassword = useCallback((u: IStaffUser) => {
    setConfirmReset(u);
  }, []);

  const handleToggleActivo = useCallback((u: IStaffUser, activo: boolean) => {
    setConfirmToggle({ user: u, activo });
  }, []);

  const openCreate = () => {
    setCreateEmailLocal('');
    setCreateNombre('');
    setCreateApellido('');
    setCreatePassword('');
    setCreateOpen(true);
  };

  const submitCreate = async (close: () => void) => {
    const local = createEmailLocal.trim().toLowerCase();
    if (!isValidStaffEmailLocalPart(local)) {
      toast.error(
        'Usuario del email inválido: sin @, entre 2 y 64 caracteres, solo letras, números, punto, guión y guión bajo.'
      );
      return;
    }
    const email = `${local}@${emailDomain}`;
    try {
      const res = await createStaff.mutateAsync({
        email,
        nombre: createNombre.trim(),
        apellido: createApellido.trim() || null,
        ...(createPassword.trim().length >= 6 ? { password: createPassword } : {})
      });
      setCreateEmailLocal('');
      setCreateNombre('');
      setCreateApellido('');
      setCreatePassword('');
      close();
      setPasswordModal({
        password: res.temporaryPassword,
        title: 'Usuario creado',
        subtitle: email
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'No se pudo crear el usuario');
    }
  };

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Usuarios"
        description="Personal con acceso al administrador"
      >
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button
            variant="outline-primary"
            className="flex items-center gap-2 justify-center"
            onClick={() => void refetch()}
            disabled={isFetching}
          >
            <RefreshCw className={`h-4 w-4 shrink-0 ${isFetching ? 'animate-spin' : ''}`} />
            Refrescar
          </Button>
          <Button
            variant="primary"
            className="flex items-center gap-2 justify-center"
            onClick={openCreate}
          >
            <UserPlus className="h-4 w-4 shrink-0" />
            Nuevo usuario
          </Button>
        </div>
      </AdminPageHeader>

      <UsuariosStaffFilters {...filterState} />

      <UsuariosStaffTable
        rows={rows}
        isLoading={isLoading}
        isError={isError}
        error={error as Error | null}
        onResetPassword={handleResetPassword}
        onToggleActivo={handleToggleActivo}
      />

      {!isLoading && total > 0 && (
        <UsuariosStaffPaginacion total={total} page={page} limit={limit} onGoToPage={goToPage} />
      )}

      <SimpleModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Crear usuario"
        maxWidth="max-w-lg"
        actions={(close) => (
          <>
            <Button variant="outline-primary" onClick={close} disabled={createStaff.isPending}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              disabled={
                createStaff.isPending ||
                !createEmailLocal.trim() ||
                !createNombre.trim() ||
                (createPassword.length > 0 && createPassword.length < 6)
              }
              className="inline-flex items-center justify-center gap-2"
              onClick={() => void submitCreate(close)}
            >
              {createStaff.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden />
                  <span>Crear</span>
                </>
              ) : (
                'Crear'
              )}
            </Button>
          </>
        )}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
            <div
              className="flex w-full min-w-0 rounded-xl border border-input bg-background overflow-hidden
                focus-within:ring-2 focus-within:ring-[rgba(var(--principal-rgb),0.2)] focus-within:border-[rgba(var(--principal-rgb),0.5)]"
            >
              <input
                type="text"
                inputMode="email"
                autoComplete="off"
                value={createEmailLocal}
                onChange={(e) => {
                  const v = e.target.value.replace(/@/g, '');
                  setCreateEmailLocal(v);
                }}
                placeholder="usuario"
                className="flex-1 min-w-0 border-0 bg-transparent px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-input/50"
              />
              <div
                className="flex items-center border-l border-input px-3 py-2.5 bg-input/40 text-sm text-input/80 font-mono shrink-0 select-none"
                title="Dominio fijo"
              >
                @{emailDomain}
              </div>
            </div>
            <p className="mt-1 text-xs text-input/70">
              Solo la parte antes del arroba; no incluyas @.
            </p>
          </div>

          <Input
            label="Nombre"
            value={createNombre}
            onChange={(e) => setCreateNombre(e.target.value)}
            required
          />
          <Input
            label="Apellido"
            value={createApellido}
            onChange={(e) => setCreateApellido(e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Contraseña inicial (opcional)
            </label>
            <div className="flex gap-2 items-stretch">
              <div className="flex-1 min-w-0 [&>div]:w-full">
                <Input
                  type="text"
                  autoComplete="new-password"
                  value={createPassword}
                  onChange={(e) => setCreatePassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres si la completás"
                  className="rounded-xl! font-mono text-sm"
                />
              </div>
              <Button
                type="button"
                variant="outline-primary"
                size="sm"
                className="min-w-0! shrink-0 px-2! py-0! text-xs font-medium self-stretch gap-1 leading-tight [&>span]:gap-1"
                onClick={() => setCreatePassword(generateStaffPassword())}
              >
                <Wand2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
                Gen.
              </Button>
            </div>
            <p className="mt-1 text-xs text-input/70">
              Si la dejás vacía, el servidor genera una contraseña segura (te la mostramos al crear).
            </p>
          </div>
        </div>
      </SimpleModal>

      <CopyPasswordModal
        isOpen={!!passwordModal}
        onClose={() => setPasswordModal(null)}
        password={passwordModal?.password ?? ''}
        title={passwordModal?.title}
        subtitle={passwordModal?.subtitle}
      />

      <ConfirmModal
        isOpen={!!confirmReset}
        onClose={() => setConfirmReset(null)}
        title="Reiniciar contraseña"
        description={`Se generará una nueva contraseña para ${confirmReset?.email ?? ''}. Solo se mostrará una vez.`}
        type="warning"
        confirmText="Reiniciar"
        onConfirm={async () => {
          if (!confirmReset) return;
          const res = await resetPassword.mutateAsync(confirmReset.id_usuario);
          setPasswordModal({
            password: res.temporaryPassword,
            title: 'Contraseña reiniciada',
            subtitle: confirmReset.email ?? undefined
          });
        }}
      />

      <ConfirmModal
        isOpen={!!confirmToggle}
        onClose={() => setConfirmToggle(null)}
        title={confirmToggle?.activo ? 'Reactivar usuario' : 'Dar de baja'}
        description={
          confirmToggle?.activo
            ? `¿Reactivar el acceso al panel para ${confirmToggle.user.email ?? confirmToggle.user.id_usuario}?`
            : `¿Dar de baja a ${confirmToggle?.user.email ?? confirmToggle?.user.id_usuario}? No podrá iniciar sesión hasta que lo reactives.`
        }
        type="warning"
        confirmText={confirmToggle?.activo ? 'Reactivar' : 'Dar de baja'}
        onConfirm={async () => {
          if (!confirmToggle) return;
          try {
            await setActive.mutateAsync({
              idUsuario: confirmToggle.user.id_usuario,
              activo: confirmToggle.activo
            });
            toast.success(
              confirmToggle.activo ? 'Usuario reactivado.' : 'Usuario dado de baja.'
            );
          } catch (e) {
            toast.error(e instanceof Error ? e.message : 'No se pudo actualizar el estado.');
            throw e;
          }
        }}
      />

    </AdminPageContainer>
  );
}
