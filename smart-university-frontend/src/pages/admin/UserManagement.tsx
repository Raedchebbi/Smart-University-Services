import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../../hooks/useUsers';
import { DataTable, type Column } from '../../components/DataTable';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Badge } from '../../components/Badge';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { User, UserRole } from '../../types/user';
import toast from 'react-hot-toast';

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(4, 'Min 4 characters'),
  role: z.enum(['STUDENT', 'TEACHER', 'ADMIN']),
});
type UserForm = z.infer<typeof userSchema>;

export default function UserManagement() {
  const { data, isLoading } = useUsers();
  const createMut = useCreateUser();
  const updateMut = useUpdateUser();
  const deleteMut = useDeleteUser();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<UserForm>({ resolver: zodResolver(userSchema) });
  const watchedName = useWatch({ control, name: 'name', defaultValue: '' });
  const generatedUsername = watchedName.toLowerCase().replace(/\s+/g, '.');

  const openCreate = () => { setEditing(null); reset({ name: '', email: '', password: '', role: 'STUDENT' }); setModalOpen(true); };
  const openEdit = (u: User) => { setEditing(u); reset({ name: u.name, email: u.email, password: '', role: u.role }); setModalOpen(true); };

  const onSubmit = (vals: UserForm) => {
    if (editing) {
      updateMut.mutate({ id: editing.id, data: vals }, { onSuccess: () => setModalOpen(false) });
    } else {
      const loginUsername = vals.name.toLowerCase().replace(/\s+/g, '.');
      createMut.mutate(vals, {
        onSuccess: () => {
          setModalOpen(false);
          toast.success(`User created! Login: ${loginUsername} / ${vals.password}`, { duration: 8000 });
        },
      });
    }
  };

  const filtered = data?.filter((u) => roleFilter === 'ALL' || u.role === roleFilter);

  const roleBadge = (role: UserRole) => {
    const v = role === 'ADMIN' ? 'danger' : role === 'TEACHER' ? 'info' : 'success';
    return <Badge text={role} variant={v} />;
  };

  const columns: Column<User>[] = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role', render: (u) => roleBadge(u.role) },
    {
      key: 'actions', header: 'Actions', render: (u) => (
        <div className="flex gap-2">
          <button onClick={(e) => { e.stopPropagation(); openEdit(u); }} className="p-1 text-gray-500 hover:text-indigo-600"><Pencil className="h-4 w-4" /></button>
          <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(u); }} className="p-1 text-gray-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
          <Plus className="h-4 w-4" /> Add User
        </button>
      </div>

      <div className="mb-4">
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
          <option value="ALL">All Roles</option>
          <option value="STUDENT">STUDENT</option>
          <option value="TEACHER">TEACHER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </div>

      <DataTable columns={columns} data={filtered} isLoading={isLoading} keyExtractor={(u) => u.id} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit User' : 'Create User'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input {...register('name')} className="w-full border rounded-lg px-3 py-2 text-sm" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            {!editing && generatedUsername && (
              <p className="text-xs text-gray-400 mt-1">Login username will be: <span className="font-mono text-indigo-600">{generatedUsername}</span></p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input {...register('email')} type="email" className="w-full border rounded-lg px-3 py-2 text-sm" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input {...register('password')} type="password" className="w-full border rounded-lg px-3 py-2 text-sm" />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select {...register('role')} className="w-full border rounded-lg px-3 py-2 text-sm">
              <option value="STUDENT">STUDENT</option>
              <option value="TEACHER">TEACHER</option>
              <option value="ADMIN">ADMIN</option>
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
