import { UsuariosStaffPageClient } from '@/app/components/tables/UsuariosStaff/UsuariosStaffPageClient';

/**
 * Shell de ruta: el layout admin ya aplica AuthGuard.
 * Contenido dinámico (tabla, filtros, modales) vive en el cliente.
 */
export default function AdminUsuariosPage() {
  return <UsuariosStaffPageClient />;
}
