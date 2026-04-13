import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGrades, useUpdateGrade } from '../../hooks/useGrades';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { EmptyState } from '../../components/EmptyState';
import { Modal } from '../../components/Modal';
import type { Grade } from '../../types/grade';
import { Download, Pencil } from 'lucide-react';

const editSchema = z.object({
  studentName: z.string().min(1),
  subject: z.string().min(1),
  examType: z.string().min(1),
  semester: z.string().min(1),
  score: z.coerce.number().min(0).max(20),
});
type EditForm = z.infer<typeof editSchema>;

export default function GradeList() {
  const { data, isLoading, isError, error } = useGrades();
  const updateMut = useUpdateGrade();
  const [semesterFilter, setSemesterFilter] = useState('');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Grade | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EditForm>({ resolver: zodResolver(editSchema) });

  const openEdit = (g: Grade) => {
    setEditing(g);
    reset({ studentName: g.studentName, subject: g.subject, examType: g.examType, semester: g.semester, score: g.score });
  };

  const onSubmit = (vals: EditForm) => {
    if (!editing) return;
    updateMut.mutate({ id: editing.id, data: vals }, { onSuccess: () => setEditing(null) });
  };

  const semesters = [...new Set(data?.map((g) => g.semester) ?? [])];

  const filtered = data?.filter((g: Grade) => {
    if (semesterFilter && g.semester !== semesterFilter) return false;
    if (search && !g.studentName.toLowerCase().includes(search.toLowerCase()) && !g.subject.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const exportCSV = () => {
    if (!filtered || filtered.length === 0) return;
    const header = 'Student,Subject,Exam Type,Grade,Semester,Date\n';
    const rows = filtered.map((g: Grade) =>
      `${g.studentName},${g.subject},${g.examType},${g.score},${g.semester},${new Date(g.createdAt).toLocaleDateString()}`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grades.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <nav className="text-xs text-gray-400 mb-2">Dashboard &gt; All Grades</nav>
      <h1 className="text-2xl font-bold mb-6">All Grades</h1>

      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search student or subject…"
          className="border rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select value={semesterFilter} onChange={(e) => setSemesterFilter(e.target.value)} className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">All Semesters</option>
          {semesters.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={exportCSV} disabled={!filtered || filtered.length === 0} className="ml-auto flex items-center gap-1.5 border rounded-lg px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-40 transition-colors">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      {isLoading && <LoadingSkeleton rows={8} />}

      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error instanceof Error ? error.message : 'Unable to load grades.'}
        </div>
      )}

      {!isLoading && !isError && (!filtered || filtered.length === 0) && (
        <EmptyState message="No grades found" />
      )}

      {!isLoading && !isError && filtered && filtered.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Subject</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Exam Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Grade</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Semester</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filtered.map((g: Grade, i: number) => (
                <tr key={g.id} className={`hover:bg-gray-50 transition-colors ${i % 2 === 1 ? 'bg-gray-50/50' : ''}`}>
                  <td className="px-4 py-3 text-sm text-gray-700">{g.studentName}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{g.subject}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{g.examType}</td>
                  <td className="px-4 py-3 text-sm font-semibold">
                    <span className={g.score >= 10 ? 'text-green-600' : 'text-red-600'}>{g.score}/20</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{g.semester}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{new Date(g.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm">
                    <button onClick={() => openEdit(g)} className="p-1 text-gray-500 hover:text-indigo-600" title="Edit"><Pencil className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit Grade">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Student Name</label>
            <input {...register('studentName')} className="w-full border rounded-lg px-3 py-2 text-sm" />
            {errors.studentName && <p className="text-red-500 text-xs mt-1">{errors.studentName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <input {...register('subject')} className="w-full border rounded-lg px-3 py-2 text-sm" />
            {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Exam Type</label>
            <select {...register('examType')} className="w-full border rounded-lg px-3 py-2 text-sm">
              <option value="Midterm">Midterm</option>
              <option value="Final">Final</option>
              <option value="Quiz">Quiz</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Semester</label>
            <input {...register('semester')} className="w-full border rounded-lg px-3 py-2 text-sm" />
            {errors.semester && <p className="text-red-500 text-xs mt-1">{errors.semester.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Score (/20)</label>
            <input {...register('score')} type="number" step="0.5" min="0" max="20" className="w-full border rounded-lg px-3 py-2 text-sm" />
            {errors.score && <p className="text-red-500 text-xs mt-1">{errors.score.message}</p>}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
            <button type="submit" disabled={updateMut.isPending} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50">
              {updateMut.isPending ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
