import { useAuth } from '../../auth/useAuth';
import { StatCard } from '../../components/StatCard';
import { DataTable, type Column } from '../../components/DataTable';
import { useUsers } from '../../hooks/useUsers';
import { useCourses } from '../../hooks/useCourses';
import { useGrades, useGradeStats } from '../../hooks/useGrades';
import { useReclamations } from '../../hooks/useReclamations';
import { Badge, statusVariant } from '../../components/Badge';
import { Users, BookOpen, GraduationCap, FileText, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import type { Reclamation } from '../../types/reclamation';
import type { Grade } from '../../types/grade';

function AdminDashboard() {
  const { data: users, isLoading: ul } = useUsers();
  const { data: courses, isLoading: cl } = useCourses();
  const { count } = useGradeStats();
  const { data: reclamations, isLoading: rl } = useReclamations();

  const pendingCount = reclamations?.filter((r) => r.status === 'PENDING').length ?? 0;

  const recCols: Column<Reclamation>[] = [
    { key: 'subject', header: 'Subject' },
    { key: 'type', header: 'Type' },
    { key: 'status', header: 'Status', render: (r) => <Badge text={r.status} variant={statusVariant(r.status)} /> },
    { key: 'createdAt', header: 'Date', render: (r) => new Date(r.createdAt).toLocaleDateString() },
  ];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Users" value={ul ? '...' : (users?.length ?? 0)} icon={Users} color="text-blue-600" />
        <StatCard title="Courses" value={cl ? '...' : (courses?.length ?? 0)} icon={BookOpen} color="text-green-600" />
        <StatCard title="Total Grades" value={count.isLoading ? '...' : (count.data ?? 0)} icon={GraduationCap} color="text-purple-600" />
        <StatCard title="Pending Reclamations" value={rl ? '...' : pendingCount} icon={FileText} color="text-orange-600" />
      </div>
      <h3 className="text-lg font-semibold mb-3">Recent Reclamations</h3>
      <DataTable columns={recCols} data={reclamations?.slice(0, 5)} isLoading={rl} keyExtractor={(r) => r.id} />
    </>
  );
}

function TeacherDashboard() {
  const { avg, max, min, count } = useGradeStats();
  const { data: grades, isLoading: gl } = useGrades();

  const gradeCols: Column<Grade>[] = [
    { key: 'studentName', header: 'Student' },
    { key: 'subject', header: 'Subject' },
    { key: 'score', header: 'Grade', render: (g) => String(g.score) },
    { key: 'createdAt', header: 'Date', render: (g) => new Date(g.createdAt).toLocaleDateString() },
  ];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Average" value={avg.isLoading ? '...' : (avg.data?.toFixed(1) ?? 'N/A')} icon={BarChart3} color="text-indigo-600" />
        <StatCard title="Max" value={max.isLoading ? '...' : (max.data ?? 'N/A')} icon={TrendingUp} color="text-green-600" />
        <StatCard title="Min" value={min.isLoading ? '...' : (min.data ?? 'N/A')} icon={TrendingDown} color="text-red-600" />
        <StatCard title="Total Grades" value={count.isLoading ? '...' : (count.data ?? 0)} icon={GraduationCap} color="text-purple-600" />
      </div>
      <h3 className="text-lg font-semibold mb-3">Recent Grades</h3>
      <DataTable columns={gradeCols} data={grades?.slice(0, 10)} isLoading={gl} keyExtractor={(g) => g.id} />
    </>
  );
}

function StudentDashboard() {
  const { avg, count } = useGradeStats();

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <StatCard title="Total Grades" value={count.isLoading ? '...' : (count.data ?? 0)} icon={GraduationCap} color="text-indigo-600" />
        <StatCard title="Average Score" value={avg.isLoading ? '...' : (avg.data?.toFixed(1) ?? 'N/A')} icon={BarChart3} color="text-green-600" />
      </div>
      <p className="text-sm text-gray-500">View your detailed grades in the <strong>My Grades</strong> page.</p>
    </>
  );
}

export default function Dashboard() {
  const { hasRole } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      {hasRole('ADMIN') && <AdminDashboard />}
      {hasRole('TEACHER') && !hasRole('ADMIN') && <TeacherDashboard />}
      {hasRole('STUDENT') && !hasRole('ADMIN') && !hasRole('TEACHER') && <StudentDashboard />}
    </div>
  );
}
