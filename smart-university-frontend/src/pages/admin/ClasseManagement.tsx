import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useClasses, useCreateClasse, useUpdateClasse, useDeleteClasse, useAddEtudiants } from '../../hooks/useClasses';
import { useNiveaux } from '../../hooks/useNiveaux';
import { useUsersByRole } from '../../hooks/useUsers';
import { DataTable, type Column } from '../../components/DataTable';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Plus, Pencil, Trash2, UserPlus } from 'lucide-react';
import type { Classe } from '../../types/classe';
import type { Niveau } from '../../types/niveau';

const classeSchema = z.object({
  nom: z.string().min(1, 'Nom is required'),
  niveauId: z.string().min(1, 'Niveau is required'),
  capacite: z.coerce.number().min(1, 'Min capacity 1'),
  anneeUniversitaire: z.string().min(1, 'Year required'),
});
type ClasseForm = z.infer<typeof classeSchema>;

const etudiantSchema = z.object({
  ids: z.string().min(1, 'Enter at least one username'),
});
type EtudiantForm = z.infer<typeof etudiantSchema>;

export default function ClasseManagement() {
  const { data, isLoading } = useClasses();
  const { data: niveaux } = useNiveaux();
  const { data: students } = useUsersByRole('STUDENT');
  const createMut = useCreateClasse();
  const updateMut = useUpdateClasse();
  const deleteMut = useDeleteClasse();
  const addEtMut = useAddEtudiants();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Classe | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Classe | null>(null);
  const [etudiantTarget, setEtudiantTarget] = useState<Classe | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ClasseForm>({ resolver: zodResolver(classeSchema) });
  const etForm = useForm<EtudiantForm>({ resolver: zodResolver(etudiantSchema) });

  const openCreate = () => { setEditing(null); reset({ nom: '', niveauId: '', capacite: 30, anneeUniversitaire: '2024-2025' }); setModalOpen(true); };
  const openEdit = (c: Classe) => {
    setEditing(c);
    const nId = typeof c.niveauId === 'string' ? c.niveauId : (c.niveauId as Niveau)._id;
    reset({ nom: c.nom, niveauId: nId, capacite: c.capacite, anneeUniversitaire: c.anneeUniversitaire });
    setModalOpen(true);
  };

  const onSubmit = (vals: ClasseForm) => {
    if (editing) {
      updateMut.mutate({ id: editing._id, data: vals }, { onSuccess: () => setModalOpen(false) });
    } else {
      createMut.mutate(vals, { onSuccess: () => setModalOpen(false) });
    }
  };

  const onAddEtudiants = () => {
    if (!etudiantTarget || selectedStudents.length === 0) return;
    addEtMut.mutate({ id: etudiantTarget._id, data: { etudiantIds: selectedStudents } }, {
      onSuccess: () => { setEtudiantTarget(null); setSelectedStudents([]); },
    });
  };

  const toUsername = (name: string) => name.toLowerCase().replace(/\s+/g, '.');

  const toggleStudent = (username: string) => {
    setSelectedStudents((prev) =>
      prev.includes(username) ? prev.filter((s) => s !== username) : [...prev, username],
    );
  };

  const getNiveauName = (c: Classe) => {
    if (typeof c.niveauId === 'object' && c.niveauId !== null) return (c.niveauId as Niveau).nom;
    const n = niveaux?.find((niv) => niv._id === c.niveauId);
    return n?.nom ?? String(c.niveauId);
  };

  const columns: Column<Classe>[] = [
    { key: 'nom', header: 'Nom' },
    { key: 'niveauId', header: 'Niveau', render: (c) => getNiveauName(c) },
    { key: 'capacite', header: 'Capacity' },
    { key: 'anneeUniversitaire', header: 'Year' },
    { key: 'etudiants', header: 'Students', render: (c) => c.etudiants.length },
    {
      key: 'actions', header: 'Actions', render: (c) => (
        <div className="flex gap-2">
          <button onClick={(e) => { e.stopPropagation(); setEtudiantTarget(c); setSelectedStudents([]); }} className="p-1 text-gray-500 hover:text-green-600" title="Manage Students"><UserPlus className="h-4 w-4" /></button>
          <button onClick={(e) => { e.stopPropagation(); openEdit(c); }} className="p-1 text-gray-500 hover:text-indigo-600"><Pencil className="h-4 w-4" /></button>
          <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(c); }} className="p-1 text-gray-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Classe Management</h1>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
          <Plus className="h-4 w-4" /> Add Classe
        </button>
      </div>

      <DataTable columns={columns} data={data} isLoading={isLoading} keyExtractor={(c) => c._id} />

      {/* Create / Edit modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Classe' : 'Create Classe'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom</label>
            <input {...register('nom')} className="w-full border rounded-lg px-3 py-2 text-sm" />
            {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Niveau</label>
            <select {...register('niveauId')} className="w-full border rounded-lg px-3 py-2 text-sm">
              <option value="">Select niveau</option>
              {niveaux?.map((n) => <option key={n._id} value={n._id}>{n.nom} ({n.code})</option>)}
            </select>
            {errors.niveauId && <p className="text-red-500 text-xs mt-1">{errors.niveauId.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Capacity</label>
            <input {...register('capacite')} type="number" className="w-full border rounded-lg px-3 py-2 text-sm" />
            {errors.capacite && <p className="text-red-500 text-xs mt-1">{errors.capacite.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Academic Year</label>
            <input {...register('anneeUniversitaire')} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="2024-2025" />
            {errors.anneeUniversitaire && <p className="text-red-500 text-xs mt-1">{errors.anneeUniversitaire.message}</p>}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
            <button type="submit" disabled={createMut.isPending || updateMut.isPending} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50">
              {editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add students modal */}
      <Modal open={!!etudiantTarget} onClose={() => setEtudiantTarget(null)} title={`Add Students to ${etudiantTarget?.nom ?? ''}`}>
        <p className="text-sm text-gray-500 mb-2">Current students: <span className="font-semibold">{etudiantTarget?.etudiants.length ?? 0}</span></p>
        {etudiantTarget && etudiantTarget.etudiants.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {etudiantTarget.etudiants.map((s) => (
              <span key={s} className="inline-block bg-indigo-50 text-indigo-700 text-xs font-mono px-2 py-0.5 rounded">{s}</span>
            ))}
          </div>
        )}
        <p className="text-sm font-medium mb-2">Select students to add:</p>
        <div className="max-h-60 overflow-y-auto border rounded-lg divide-y">
          {students?.filter((s) => !etudiantTarget?.etudiants.includes(toUsername(s.name))).map((s) => {
            const uname = toUsername(s.name);
            return (
              <label key={s.id} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm">
                <input type="checkbox" checked={selectedStudents.includes(uname)} onChange={() => toggleStudent(uname)} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="font-medium">{s.name}</span>
                <span className="text-gray-400 font-mono text-xs ml-auto">{uname}</span>
              </label>
            );
          })}
          {students?.filter((s) => !etudiantTarget?.etudiants.includes(toUsername(s.name))).length === 0 && (
            <p className="text-sm text-gray-400 p-3">All students are already in this class.</p>
          )}
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={() => setEtudiantTarget(null)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
          <button onClick={onAddEtudiants} disabled={addEtMut.isPending || selectedStudents.length === 0} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50">
            Add {selectedStudents.length > 0 ? `(${selectedStudents.length})` : ''}
          </button>
        </div>
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
