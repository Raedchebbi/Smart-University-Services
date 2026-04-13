import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateReclamation } from '../../hooks/useReclamations';
import { useAuth } from '../../auth/useAuth';
import { Spinner } from '../../components/Spinner';

const reclamationSchema = z.object({
  subject: z.string().min(1, 'Subject required'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  type: z.string().min(1, 'Select a type'),
});
type ReclamationForm = z.infer<typeof reclamationSchema>;

export default function SubmitReclamation() {
  const { username } = useAuth();
  const createMut = useCreateReclamation();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ReclamationForm>({ resolver: zodResolver(reclamationSchema) });

  const onSubmit = (vals: ReclamationForm) => {
    createMut.mutate(
      { studentName: username, subject: vals.subject, description: vals.description, type: vals.type, status: 'PENDING' },
      { onSuccess: () => reset() },
    );
  };

  return (
    <div className="max-w-lg mx-auto">
      <nav className="text-xs text-gray-400 mb-2">Dashboard &gt; New Reclamation</nav>
      <h1 className="text-2xl font-bold mb-6">Submit Reclamation</h1>
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <input {...register('subject')} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select {...register('type')} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">Select a type</option>
              <option value="GRADE">Grade</option>
              <option value="ATTENDANCE">Attendance</option>
              <option value="SCHEDULE">Schedule</option>
              <option value="OTHER">Other</option>
            </select>
            {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea {...register('description')} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" rows={4} placeholder="Describe your reclamation in detail (min 20 chars)…" />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>
          <button type="submit" disabled={createMut.isPending} className="w-full py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-sm font-medium flex items-center justify-center gap-2">
            {createMut.isPending && <Spinner size="sm" />}
            {createMut.isPending ? 'Submitting…' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}
