import { useStudentReclamations } from '../../hooks/useReclamations';
import { useAuth } from '../../auth/useAuth';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { EmptyState } from '../../components/EmptyState';
import { StatusBadge } from '../../components/StatusBadge';
import type { Reclamation, ReclamationStatus } from '../../types/reclamation';

export default function MyReclamations() {
  const { username } = useAuth();
  const { data: myReclamations = [], isLoading, isError, error } = useStudentReclamations(username);

  return (
    <div>
      <nav className="text-xs text-gray-400 mb-2">Dashboard &gt; My Reclamations</nav>
      <h1 className="text-2xl font-bold mb-6">My Reclamations</h1>

      {isLoading && <LoadingSkeleton rows={4} />}

      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error instanceof Error ? error.message : 'Unable to load reclamations.'}
        </div>
      )}

      {!isLoading && !isError && myReclamations.length === 0 && (
        <EmptyState message="No reclamations submitted yet" />
      )}

      {!isLoading && !isError && myReclamations.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Subject</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Submitted</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {myReclamations.map((r: Reclamation, i: number) => (
                <tr key={r.id} className={`hover:bg-gray-50 transition-colors ${i % 2 === 1 ? 'bg-gray-50/50' : ''}`}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{r.subject}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{r.description}</td>
                  <td className="px-4 py-3 text-sm"><StatusBadge status={r.status as ReclamationStatus} /></td>
                  <td className="px-4 py-3 text-sm text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
