import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCourses, useCreateCourse, useUpdateCourse, useDeleteCourse } from '../../hooks/useCourses';
import { useUsersByRole } from '../../hooks/useUsers';
import { DataTable, type Column } from '../../components/DataTable';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { CourseResponseDTO } from '../../types/course';

const courseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  credits: z.coerce.number().min(1, 'Min 1 credit'),
  professorId: z.coerce.number().optional(),
});
type CourseForm = z.infer<typeof courseSchema>;

export default function CourseManagement() {
  const { data, isLoading } = useCourses();
  const { data: teachers } = useUsersByRole('TEACHER');
  const createMut = useCreateCourse();
  const updateMut = useUpdateCourse();
  const deleteMut = useDeleteCourse();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CourseResponseDTO | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CourseResponseDTO | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CourseForm>({ resolver: zodResolver(courseSchema) });

  const openCreate = () => { setEditing(null); reset({ title: '', description: '', credits: 3 }); setModalOpen(true); };
  const openEdit = (c: CourseResponseDTO) => { setEditing(c); reset({ title: c.title, description: c.description ?? '', credits: c.credits, professorId: c.professorId ?? undefined }); setModalOpen(true); };

  const onSubmit = (vals: CourseForm) => {
    const payload = { title: vals.title, credits: vals.credits, description: vals.description, professorId: vals.professorId };
    if (editing) {
      updateMut.mutate({ id: editing.id, data: payload }, { onSuccess: () => setModalOpen(false) });
    } else {
      createMut.mutate(payload, { onSuccess: () => setModalOpen(false) });
    }
  };

  const columns: Column<CourseResponseDTO>[] = [
    { key: 'id', header: 'ID' },
    { key: 'title', header: 'Title' },
    { key: 'credits', header: 'Credits' },
    { key: 'professorId', header: 'Professor', render: (c) => {
      const t = teachers?.find((t) => t.id === c.professorId);
      return t ? t.name : (c.professorId ? `#${c.professorId}` : '—');
    } },
    { key: 'createdAt', header: 'Created', render: (c) => new Date(c.createdAt).toLocaleDateString() },
    {
      key: 'actions', header: 'Actions', render: (c) => (
        <div className="flex gap-2">
          <button onClick={(e) => { e.stopPropagation(); openEdit(c); }} className="p-1 text-gray-500 hover:text-indigo-600"><Pencil className="h-4 w-4" /></button>
          <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(c); }} className="p-1 text-gray-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Course Management</h1>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
          <Plus className="h-4 w-4" /> Add Course
        </button>
      </div>

      <DataTable columns={columns} data={data} isLoading={isLoading} keyExtractor={(c) => c.id} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Course' : 'Create Course'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input {...register('title')} className="w-full border rounded-lg px-3 py-2 text-sm" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea {...register('description')} className="w-full border rounded-lg px-3 py-2 text-sm" rows={3} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Credits</label>
            <input {...register('credits')} type="number" className="w-full border rounded-lg px-3 py-2 text-sm" />
            {errors.credits && <p className="text-red-500 text-xs mt-1">{errors.credits.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Professor</label>
            <select {...register('professorId')} className="w-full border rounded-lg px-3 py-2 text-sm">
              <option value="">No professor</option>
              {teachers?.map((t) => <option key={t.id} value={t.id}>{t.name} ({t.email})</option>)}
            </select>
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
        onConfirm={() => { if (deleteTarget) deleteMut.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) }); }}
        loading={deleteMut.isPending}
      />
    </div>
  );
}
