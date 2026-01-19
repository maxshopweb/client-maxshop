"use client";

import { MapPin, Plus, Edit, Trash2, Star } from "lucide-react";
import ProfileCard from "./ProfileCard";
import { Button } from "@/app/components/ui/Button";
import AddressForm from "./AddressForm";
import ConfirmModal from "@/app/components/modals/ConfirmModal";
import { useDirecciones } from "@/app/hooks/direcciones/useDirecciones";
import { useDireccionesMutations } from "@/app/hooks/direcciones/useDireccionesMutations";
import { useAddressForm } from "@/app/hooks/direcciones/useAddressForm";
import { useAddressModal } from "@/app/hooks/direcciones/useAddressModal";
import { useAddressEdit } from "@/app/hooks/direcciones/useAddressEdit";
import type { IDireccion } from "@/app/services/direcciones.service";
import AddressCardSkeleton from "./AddressCardSkeleton";

export default function AddressesSection() {
  const { direcciones, isLoading } = useDirecciones();
  const { createDireccion, updateDireccion, deleteDireccion, setPrincipal, isCreating, isUpdating, isDeleting } = useDireccionesMutations();
  const { formData, setFormData, resetForm, setFormDataFromDireccion, hasChanges } = useAddressForm();
  const { isOpen, openModal, closeModal, confirmDelete } = useAddressModal();
  const { editingId, showAddForm, isClosing, closingId, startEdit, startAdd, cancel, finishEdit, finishAdd, isEditing, getAnimationClass } = useAddressEdit();

  const handleEdit = (direccion: IDireccion) => {
    setFormDataFromDireccion(direccion);
    startEdit(direccion);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Asegurar que es_principal siempre esté definido (true o false)
    const dataToSubmit = {
      ...formData,
      es_principal: formData.es_principal ?? false,
    };
    
    if (editingId) {
      updateDireccion(
        { id: editingId, data: dataToSubmit },
        {
          onSuccess: () => {
            finishEdit();
            resetForm();
          },
        }
      );
    } else {
      createDireccion(dataToSubmit, {
        onSuccess: () => {
          finishAdd();
          resetForm();
        },
      });
    }
  };

  const handleCancel = () => {
    cancel(() => {
      resetForm();
    });
  };

  const handleDeleteClick = (id: string) => {
    openModal(id);
  };

  const handleConfirmDelete = () => {
    confirmDelete((id) => {
      deleteDireccion(id);
    });
  };

  const handleStartAdd = () => {
    resetForm();
    startAdd();
  };

  if (isLoading) {
    return (
      <ProfileCard title="Mis direcciones" icon={MapPin}>
        <AddressCardSkeleton />
      </ProfileCard>
    );
  }

  return (
    <>
      <ConfirmModal
        isOpen={isOpen}
        onClose={closeModal}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar dirección?"
        description="Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar esta dirección?"
        type="warning"
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
      <ProfileCard title="Mis direcciones" icon={MapPin}>
        <div className="space-y-4">
          {/* Lista de direcciones */}
          {direcciones.map((direccion) => (
            <div
              key={direccion.id_direccion}
              className={`p-4 border rounded-lg bg-background transition-all duration-300 ${
                direccion.es_principal ? "border-input bg-principal/5" : "border-input"
              }`}
            >
              {isEditing(direccion.id_direccion) ? (
                <div className={getAnimationClass(direccion.id_direccion)}>
                  <AddressForm
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isSubmitting={isUpdating}
                    checkboxId={`principal-${direccion.id_direccion}`}
                    isPrincipal={direccion.es_principal}
                    hasChanges={hasChanges}
                  />
                </div>
              ) : (
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-foreground">
                      {direccion.nombre || "Sin nombre"}
                    </h4>
                    {direccion.es_principal && (
                      <span className="text-xs bg-principal/20 text-principal px-2.5 py-1 rounded-md font-medium border border-principal/30">
                        Principal
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-foreground/70 mb-1">
                    {direccion.direccion} {direccion.altura}
                    {direccion.piso && `, Piso ${direccion.piso}`}
                    {direccion.dpto && `, Dpto ${direccion.dpto}`}
                  </p>
                  <p className="text-sm text-foreground/70">
                    {direccion.ciudad}, {direccion.provincia} ({direccion.cod_postal})
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  {!direccion.es_principal && (
                    <Button
                      onClick={() => setPrincipal(direccion.id_direccion)}
                      variant="ghost"
                      size="sm"
                      className="p-2"
                      title="Marcar como principal"
                    >
                      <Star className="w-4 h-4 text-foreground/60" />
                    </Button>
                  )}
                  <Button
                    onClick={() => handleEdit(direccion)}
                    variant="ghost"
                    size="sm"
                    className="p-2"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4 text-foreground/60" />
                  </Button>
                  <Button
                    onClick={() => handleDeleteClick(direccion.id_direccion)}
                    variant="ghost"
                    size="sm"
                    className="p-2 hover:bg-red-50 text-red-600 hover:text-red-700"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Formulario para agregar nueva dirección */}
        {(showAddForm || isClosing) && (
          <div className={`p-4 border border-principal/30 rounded-lg bg-principal/5 ${isClosing ? "animate-slide-up" : "animate-slide-down"}`}>
            <h3 className="font-semibold mb-4">Agregar nueva dirección</h3>
            <AddressForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isSubmitting={isCreating}
              checkboxId="es_principal_new"
              hasChanges={hasChanges}
            />
          </div>
        )}

        {/* Botón para agregar nueva dirección */}
        {!showAddForm && !isClosing && direcciones.length < 3 && (
          <Button
            onClick={handleStartAdd}
            variant="outline-primary"
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar dirección
          </Button>
        )}

        {direcciones.length >= 3 && (
          <p className="text-sm text-foreground/50 text-center">
            Has alcanzado el máximo de 3 direcciones
          </p>
        )}

        {direcciones.length === 0 && !showAddForm && !isClosing && (
          <div className="text-center py-8 text-foreground/70">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-foreground/30" />
            <p className="mb-4">No tienes direcciones guardadas</p>
            <Button
              onClick={handleStartAdd}
              variant="primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar primera dirección
            </Button>
          </div>
        )}
      </div>
    </ProfileCard>
    <style dangerouslySetInnerHTML={{
      __html: `
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
            max-height: 0;
            padding-top: 0;
            padding-bottom: 0;
            margin-bottom: 0;
          }
          to {
            opacity: 1;
            transform: translateY(0);
            max-height: 2000px;
            padding-top: 1rem;
            padding-bottom: 1rem;
            margin-bottom: 1rem;
          }
        }
        @keyframes slide-up {
          from {
            opacity: 1;
            transform: translateY(0);
            max-height: 2000px;
          }
          to {
            opacity: 0;
            transform: translateY(-10px);
            max-height: 0;
            padding-top: 0;
            padding-bottom: 0;
            margin-bottom: 0;
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out forwards;
          overflow: hidden;
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-in forwards;
          overflow: hidden;
        }
      `
    }} />
    </>
  );
}

