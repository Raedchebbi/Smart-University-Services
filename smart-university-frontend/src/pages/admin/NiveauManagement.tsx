import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNiveaux, useCreateNiveau, useUpdateNiveau, useDeleteNiveau } from '../../hooks/useNiveaux';
import { DataTable, type Column } from '../../components/DataTable';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { Niveau } from '../../types/niveau';

const niveauSchema = z.object({
  nom: z.string().min(1, 'Nom is required'),
  code: z.string().min(1, 'Code is required'),
  description: z.string().optional(),
});
type NiveauForm = z.infer<typeof niveauSchema>;

export default function NiveauManagement() {
  const { data, isLoading } = useNiveaux();
  const createMut = useCreateNiveau();
  const updateMut = useUpdateNiveau();
  const deleteMut = useDeleteNiveau();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Niveau | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Niveau | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<NiveauForm>({ resolver: zodResolver(niveauSchema) });

  const openCreate = () => { setEditing(null); reset({ nom: '', code: '', description: '' }); setModalOpen(true); };
  const openEdit = (n: Niveau) => { setEditing(n); reset({ nom: n.nom, code: n.code, description: n.description }); setModalOpen(true); };

  const onSubmit = (vals: NiveauForm) => {
    if (editing) {
      updateMut.mutate({ id: editing._id, data: vals }, { onSuccess: () => setModalOpen(false) });
    } else {
      createMut.mutate(vals, { onSuccess: () => setModalOpen(false) });
    }
  };

  const columns: Column<Niveau>[] = [
    { key: 'code', header: 'Code' },
    { key: 'nom', header: 'Nom' },
    { key: 'description', header: 'Description' },
    {
      key: 'actions', header: 'Actions', render: (n) => (
        <div className="flex gap-2">
          <button onClick={(e) => { e.stopPropagation(); openEdit(n); }} className="p-1 text-gray-500 hover:text-indigo-600"><Pencil className="h-4 w-4" /></button>
          <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(n); }} className="p-1 text-gray-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Niveau Management</h1>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
          <Plus className="h-4 w-4" /> Add Niveau
        </button>
      </div>

      <DataTable columns={columns} data={data} isLoading={isLoading} keyExtractor={(n) => n._id} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Niveau' : 'Create Niveau'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom</label>
            <input {...register('nom')} className="w-full border rounded-lg px-3 py-2 text-sm" />
            {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Code</label>
            <input {...register('code')} className="w-full border rounded-lg px-3 py-2 text-sm" />
            {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea {...register('description')} className="w-full border rounded-lg px-3 py-2 text-sm" rows={3} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
            <button type="submit" disabled={createMut.isPending || updateMut.isPending} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50">
              {editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { if (deleteTarget) deleteMut.mutate(deleteTarget._id, { onSuccess: () => setDeleteTarget(null) }); }}
        loading={deleteMut.isPending}
      />
    </div>
  );
}
