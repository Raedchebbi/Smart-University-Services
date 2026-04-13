import { useState } from 'react';
import { useAuth } from '../../auth/useAuth';
import { useStudentGrades } from '../../hooks/useGrades';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { EmptyState } from '../../components/EmptyState';
import type { Grade } from '../../types/grade';

export default function MyGrades() {
  const { username } = useAuth();
  const { data, isLoading, isError, error } = useStudentGrades(username || undefined);
  const [semesterFilter, setSemesterFilter] = useState('');

  if (isLoading) return <PageShell><LoadingSkeleton rows={6} /></PageShell>;
  if (isError) return (
    <PageShell>
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error instanceof Error ? error.message : 'Unable to load grades. You may not have access yet.'}
      </div>
    </PageShell>
  );

  const semesters = [...new Set(data?.map((g) => g.semester) ?? [])];
  const filtered = semesterFilter ? data?.filter((g) => g.semester === semesterFilter) : data;

  return (
    <PageShell>
      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={semesterFilter}
          onChange={(e) => setSemesterFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Semesters</option>
          {semesters.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {!filtered || filtered.length === 0 ? (
        <EmptyState message="No grades yet" />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Subject</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Exam Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Grade</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Semester</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filtered.map((g: Grade, i: number) => (
                <tr key={g.id} className={`hover:bg-gray-50 transition-colors ${i % 2 === 1 ? 'bg-gray-50/50' : ''}`}>
                  <td className="px-4 py-3 text-sm text-gray-700">{g.subject}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{g.examType}</td>
                  <td className="px-4 py-3 text-sm font-semibold">
                    <span className={g.score >= 10 ? 'text-green-600' : 'text-red-600'}>{g.score}/20</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{g.semester}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{new Date(g.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageShell>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav className="text-xs text-gray-400 mb-2">Dashboard &gt; My Grades</nav>
      <h1 className="text-2xl font-bold mb-6">My Grades</h1>
      {children}
    </div>
  );
}
