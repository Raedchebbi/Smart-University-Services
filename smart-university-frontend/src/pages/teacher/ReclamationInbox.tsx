import { useState } from 'react';
import { useReclamations } from '../../hooks/useReclamations';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { EmptyState } from '../../components/EmptyState';
import { StatusBadge } from '../../components/StatusBadge';
import type { Reclamation, ReclamationStatus } from '../../types/reclamation';
import { X } from 'lucide-react';

const statusOptions: Array<ReclamationStatus | 'ALL'> = ['ALL', 'PENDING', 'RESOLVED', 'REJECTED'];

export default function ReclamationInbox() {
  const { data, isLoading, isError, error } = useReclamations();
  const [statusFilter, setStatusFilter] = useState<ReclamationStatus | 'ALL'>('ALL');
  const [selected, setSelected] = useState<Reclamation | null>(null);

  const filtered = data?.filter((r: Reclamation) => statusFilter === 'ALL' || r.status === statusFilter);

  return (
    <div className="flex gap-4">
      <div className="flex-1 min-w-0">
        <nav className="text-xs text-gray-400 mb-2">Dashboard &gt; Reclamation Inbox</nav>
        <h1 className="text-2xl font-bold mb-6">Reclamation Inbox</h1>

        <div className="flex flex-wrap gap-2 mb-4">
          {statusOptions.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${statusFilter === s ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {s}
            </button>
          ))}
        </div>

        {isLoading && <LoadingSkeleton rows={6} />}

        {isError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error instanceof Error ? error.message : 'Unable to load reclamations.'}
          </div>
        )}

        {!isLoading && !isError && (!filtered || filtered.length === 0) && (
          <EmptyState message="No reclamations found" />
        )}

        {!isLoading && !isError && filtered && filtered.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Subject</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filtered.map((r: Reclamation, i: number) => (
                  <tr
                    key={r.id}
                    onClick={() => setSelected(r)}
                    className={`cursor-pointer hover:bg-indigo-50 transition-colors ${i % 2 === 1 ? 'bg-gray-50/50' : ''} ${selected?.id === r.id ? 'bg-indigo-50' : ''}`}
                  >
                    <td className="px-4 py-3 text-sm font-mono text-xs text-gray-700">{r.studentName}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{r.subject}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{r.description}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm"><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="w-80 shrink-0 bg-white rounded-xl shadow-sm border p-5 h-fit sticky top-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Details</h3>
            <button onClick={() => setSelected(null)} className="p-1 rounded hover:bg-gray-100"><X className="h-4 w-4" /></button>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-gray-400 text-xs uppercase">Student</span>
              <p className="font-mono text-xs mt-0.5">{selected.studentName}</p>
            </div>
            <div>
              <span className="text-gray-400 text-xs uppercase">Subject</span>
              <p className="font-medium mt-0.5">{selected.subject}</p>
            </div>
            <div>
              <span className="text-gray-400 text-xs uppercase">Type</span>
              <p className="mt-0.5">{selected.type || '—'}</p>
            </div>
            <div>
              <span className="text-gray-400 text-xs uppercase">Description</span>
              <p className="mt-0.5 text-gray-700 whitespace-pre-wrap">{selected.description}</p>
            </div>
            <div>
              <span className="text-gray-400 text-xs uppercase">Status</span>
              <div className="mt-1"><StatusBadge status={selected.status} /></div>
            </div>
            <div>
              <span className="text-gray-400 text-xs uppercase">Submitted</span>
              <p className="mt-0.5">{new Date(selected.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
