import type { ReclamationStatus } from '../types/reclamation';

const statusColors: Record<ReclamationStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  RESOLVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
};

export function StatusBadge({ status }: { status: ReclamationStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status] ?? 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
}
