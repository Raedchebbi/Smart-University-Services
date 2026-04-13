import { useState } from 'react';
import { useEnrollments, useCreateEnrollment, useCancelEnrollment } from '../../hooks/useEnrollments';
import { useUsers } from '../../hooks/useUsers';
import { useCourses } from '../../hooks/useCourses';
import { DataTable, type Column } from '../../components/DataTable';
import { Modal } from '../../components/Modal';
import { Badge, statusVariant } from '../../components/Badge';
import type { EnrollmentResponseDTO } from '../../types/enrollment';
import { XCircle, Plus } from 'lucide-react';

export default function EnrollmentManagement() {
  const { data, isLoading } = useEnrollments();
  const { data: users } = useUsers();
  const { data: courses } = useCourses();
  const createMut = useCreateEnrollment();
  const cancelMut = useCancelEnrollment();

  const [modalOpen, setModalOpen] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [courseId, setCourseId] = useState('');

  const students = users?.filter((u) => u.role === 'STUDENT') ?? [];

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !courseId) return;
    createMut.mutate(
      { studentId: Number(studentId), courseId: Number(courseId) },
      { onSuccess: () => { setModalOpen(false); setStudentId(''); setCourseId(''); } },
    );
  };

  const columns: Column<EnrollmentResponseDTO>[] = [
    { key: 'id', header: 'ID' },
    { key: 'studentId', header: 'Student ID' },
    { key: 'courseTitle', header: 'Course' },
    { key: 'enrollmentDate', header: 'Date', render: (e) => new Date(e.enrollmentDate).toLocaleDateString() },
    { key: 'status', header: 'Status', render: (e) => <Badge text={e.status} variant={statusVariant(e.status)} /> },
    {
      key: 'actions', header: 'Actions', render: (e) =>
        e.status !== 'CANCELLED' ? (
          <button
            onClick={(ev) => { ev.stopPropagation(); cancelMut.mutate(e.id); }}
            className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800"
            disabled={cancelMut.isPending}
          >
            <XCircle className="h-4 w-4" /> Cancel
          </button>
        ) : <span className="text-xs text-gray-400">—</span>,
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Enrollment Management</h1>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
          <Plus className="h-4 w-4" /> Enroll Student
        </button>
      </div>
      <DataTable columns={columns} data={data} isLoading={isLoading} keyExtractor={(e) => e.id} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Enroll Student in Course">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Student</label>
            <select value={studentId} onChange={(e) => setStudentId(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
              <option value="">Select a student</option>
              {students.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.email})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Course</label>
            <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
              <option value="">Select a course</option>
              {courses?.map((c) => <option key={c.id} value={c.id}>{c.title} ({c.credits} credits)</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
            <button type="submit" disabled={createMut.isPending || !studentId || !courseId} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50">
              {createMut.isPending ? 'Enrolling…' : 'Enroll'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
