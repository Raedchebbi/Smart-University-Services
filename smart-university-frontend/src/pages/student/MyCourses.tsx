import { useCourses } from '../../hooks/useCourses';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { EmptyState } from '../../components/EmptyState';
import type { CourseResponseDTO } from '../../types/course';

export default function MyCourses() {
  const { data, isLoading, isError, error } = useCourses();

  return (
    <div>
      <nav className="text-xs text-gray-400 mb-2">Dashboard &gt; My Courses</nav>
      <h1 className="text-2xl font-bold mb-6">My Courses</h1>

      {isLoading && <LoadingSkeleton rows={5} />}

      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error instanceof Error ? error.message : 'Unable to load courses.'}
        </div>
      )}

      {!isLoading && !isError && (!data || data.length === 0) && (
        <EmptyState message="No courses available yet" />
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Credits</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {data.map((c: CourseResponseDTO, i: number) => (
                <tr key={c.id} className={`hover:bg-gray-50 transition-colors ${i % 2 === 1 ? 'bg-gray-50/50' : ''}`}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{c.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{c.description ?? '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{c.credits}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
