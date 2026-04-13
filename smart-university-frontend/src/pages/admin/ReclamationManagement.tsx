import { useReclamations } from '../../hooks/useReclamations';
import { DataTable, type Column } from '../../components/DataTable';
import { Badge, statusVariant } from '../../components/Badge';
import type { Reclamation } from '../../types/reclamation';

export default function ReclamationManagement() {
  const { data, isLoading } = useReclamations();

  const columns: Column<Reclamation>[] = [
    { key: 'id', header: 'ID' },
    { key: 'studentName', header: 'Student' },
    { key: 'subject', header: 'Subject' },
    { key: 'gradeId', header: 'Grade' },
    { key: 'status', header: 'Status', render: (r) => <Badge text={r.status} variant={statusVariant(r.status)} /> },
    { key: 'createdAt', header: 'Created', render: (r) => new Date(r.createdAt).toLocaleDateString() },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reclamation Management</h1>
      <DataTable columns={columns} data={data} isLoading={isLoading} keyExtractor={(r) => r.id} />
    </div>
  );
}
