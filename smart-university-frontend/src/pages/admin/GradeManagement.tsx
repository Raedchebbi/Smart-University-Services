import { useGrades } from '../../hooks/useGrades';
import { DataTable, type Column } from '../../components/DataTable';
import type { Grade } from '../../types/grade';

export default function GradeManagement() {
  const { data, isLoading } = useGrades();

  const columns: Column<Grade>[] = [
    { key: 'id', header: 'ID' },
    { key: 'studentId', header: 'Student' },
    { key: 'courseId', header: 'Course' },
    { key: 'semester', header: 'Semester' },
    { key: 'value', header: 'Grade', render: (g) => String(g.value) },
    { key: 'createdAt', header: 'Date', render: (g) => new Date(g.createdAt).toLocaleDateString() },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Grade Management</h1>
      <DataTable columns={columns} data={data} isLoading={isLoading} keyExtractor={(g) => g.id} />
    </div>
  );
}
