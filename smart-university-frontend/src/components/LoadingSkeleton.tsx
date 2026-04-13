export function LoadingSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            {[1, 2, 3, 4].map((i) => (
              <th key={i} className="px-4 py-3">
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i}>
              {[1, 2, 3, 4].map((j) => (
                <td key={j} className="px-4 py-3">
                  <div className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
