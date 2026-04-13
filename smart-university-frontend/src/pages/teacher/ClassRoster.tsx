import { useState } from 'react';
import { useClasses, useClasseEtudiants } from '../../hooks/useClasses';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { EmptyState } from '../../components/EmptyState';
import { Spinner } from '../../components/Spinner';
import type { Classe } from '../../types/classe';
import type { Niveau } from '../../types/niveau';

export default function ClassRoster() {
  const { data: classes, isLoading: cl, isError: classErr, error: classError } = useClasses();
  const [selectedId, setSelectedId] = useState<string>('');
  const { data: etudiants, isLoading: el } = useClasseEtudiants(selectedId || undefined);

  const getLabel = (c: Classe) => {
    const nName = typeof c.niveauId === 'object' ? (c.niveauId as Niveau).nom : '';
    return `${c.nom}${nName ? ` — ${nName}` : ''} (${c.anneeUniversitaire})`;
  };

  return (
    <div>
      <nav className="text-xs text-gray-400 mb-2">Dashboard &gt; Class Roster</nav>
      <h1 className="text-2xl font-bold mb-6">Class Roster</h1>

      {classErr && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 mb-4">
          {classError instanceof Error ? classError.message : 'Unable to load classes.'}
        </div>
      )}

      {cl ? <Spinner /> : (
        <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} className="border rounded-lg px-3 py-2 text-sm mb-6 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">Select a class</option>
          {classes?.map((c) => <option key={c._id} value={c._id}>{getLabel(c)}</option>)}
        </select>
      )}

      {selectedId && el && <LoadingSkeleton rows={5} />}

      {selectedId && !el && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Students</h2>
          {!etudiants || etudiants.length === 0 ? (
            <EmptyState message="No students in this class" />
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student ID</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {etudiants.map((id, i) => (
                    <tr key={id} className={`hover:bg-gray-50 transition-colors ${i % 2 === 1 ? 'bg-gray-50/50' : ''}`}>
                      <td className="px-4 py-3 text-sm text-gray-500">{i + 1}</td>
                      <td className="px-4 py-3 text-sm font-mono">{id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
