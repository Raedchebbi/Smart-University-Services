import { useClasses } from '../../hooks/useClasses';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { EmptyState } from '../../components/EmptyState';
import type { Niveau } from '../../types/niveau';
import { useAuth } from '../../auth/useAuth';

export default function MyClasse() {
  const { username } = useAuth();
  const { data: classes, isLoading, isError, error } = useClasses();

  if (isLoading) return (
    <PageShell><LoadingSkeleton rows={4} /></PageShell>
  );

  if (isError) return (
    <PageShell>
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error instanceof Error ? error.message : 'Unable to load class information.'}
      </div>
    </PageShell>
  );

  const myClasse = classes?.find((c) => c.etudiants.includes(username));

  if (!myClasse) return (
    <PageShell>
      <EmptyState message="You are not assigned to any class yet" />
    </PageShell>
  );

  const niveauName = typeof myClasse.niveauId === 'object' ? (myClasse.niveauId as Niveau).nom : String(myClasse.niveauId);
  const niveauCode = typeof myClasse.niveauId === 'object' ? (myClasse.niveauId as Niveau).code : '';

  return (
    <PageShell>
      <div className="bg-white rounded-xl shadow-sm border p-6 max-w-md">
        <div className="space-y-3 text-sm">
          <Row label="Name" value={myClasse.nom} />
          <Row label="Niveau" value={`${niveauName}${niveauCode ? ` (${niveauCode})` : ''}`} />
          <Row label="Academic Year" value={myClasse.anneeUniversitaire} />
          <Row label="Capacity" value={String(myClasse.capacite)} />
          <Row label="Students" value={String(myClasse.etudiants.length)} />
        </div>
      </div>

      {myClasse.etudiants.length > 0 && (
        <div className="mt-6 bg-white rounded-xl shadow-sm border p-6 max-w-md">
          <h2 className="text-lg font-semibold mb-4">Classmates</h2>
          <ul className="space-y-2">
            {myClasse.etudiants.filter((id) => id !== username).map((id, i) => (
              <li key={id} className="flex items-center gap-3 text-sm">
                <span className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-medium">{i + 1}</span>
                <span className="font-mono text-xs">{id}</span>
              </li>
            ))}
          </ul>
          {myClasse.etudiants.filter((id) => id !== username).length === 0 && (
            <p className="text-sm text-gray-400">You are the only student in this class.</p>
          )}
        </div>
      )}
    </PageShell>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav className="text-xs text-gray-400 mb-2">Dashboard &gt; My Classe</nav>
      <h1 className="text-2xl font-bold mb-6">My Classe</h1>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-100">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
