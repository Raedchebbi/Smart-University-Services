import { useCourses } from '../../hooks/useCourses';
import { DataTable, type Column } from '../../components/DataTable';
import type { CourseResponseDTO } from '../../types/course';

export default function CourseList() {
  const { data, isLoading } = useCourses();

  const columns: Column<CourseResponseDTO>[] = [
    { key: 'id', header: 'ID' },
    { key: 'title', header: 'Title' },
    { key: 'description', header: 'Description', render: (c) => c.description ?? '—' },
    { key: 'credits', header: 'Credits' },
    { key: 'createdAt', header: 'Created', render: (c) => new Date(c.createdAt).toLocaleDateString() },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Courses</h1>
      <DataTable columns={columns} data={data} isLoading={isLoading} keyExtractor={(c) => c.id} />
    </div>
  );
}
