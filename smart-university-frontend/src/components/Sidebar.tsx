import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  Layers,
  School,
  ClipboardList,
  FileText,
  PlusCircle,
  ListChecks,
  UserCircle,
  FolderOpen,
} from 'lucide-react';

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
}

export function Sidebar({ collapsed, onClose }: { collapsed: boolean; onClose?: () => void }) {
  const { hasRole } = useAuth();
  const location = useLocation();

  const shared: NavItem[] = [
    { label: 'Dashboard', to: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: 'Profile', to: '/profile', icon: <UserCircle className="h-5 w-5" /> },
  ];

  const admin: NavItem[] = hasRole('ADMIN')
    ? [
        { label: 'Users', to: '/admin/users', icon: <Users className="h-5 w-5" /> },
        { label: 'Courses', to: '/admin/courses', icon: <BookOpen className="h-5 w-5" /> },
        { label: 'Niveaux', to: '/admin/niveaux', icon: <Layers className="h-5 w-5" /> },
        { label: 'Classes', to: '/admin/classes', icon: <School className="h-5 w-5" /> },
        { label: 'Enrollments', to: '/admin/enrollments', icon: <ClipboardList className="h-5 w-5" /> },
        { label: 'Grades', to: '/admin/grades', icon: <GraduationCap className="h-5 w-5" /> },
        { label: 'Reclamations', to: '/admin/reclamations', icon: <FileText className="h-5 w-5" /> },
      ]
    : [];

  const teacher: NavItem[] = hasRole('TEACHER')
    ? [
        { label: 'Add Grade', to: '/teacher/grade-entry', icon: <PlusCircle className="h-5 w-5" /> },
        { label: 'All Grades', to: '/teacher/grades', icon: <GraduationCap className="h-5 w-5" /> },
        { label: 'Class Roster', to: '/teacher/roster', icon: <ListChecks className="h-5 w-5" /> },
        { label: 'Courses', to: '/teacher/courses', icon: <BookOpen className="h-5 w-5" /> },
        { label: 'Reclamations', to: '/teacher/reclamations', icon: <FileText className="h-5 w-5" /> },
      ]
    : [];

  const student: NavItem[] = hasRole('STUDENT')
    ? [
        { label: 'My Grades', to: '/student/grades', icon: <GraduationCap className="h-5 w-5" /> },
        { label: 'My Courses', to: '/student/courses', icon: <BookOpen className="h-5 w-5" /> },
        { label: 'My Classe', to: '/student/classe', icon: <School className="h-5 w-5" /> },
        { label: 'New Reclamation', to: '/student/reclamation/new', icon: <PlusCircle className="h-5 w-5" /> },
        { label: 'My Reclamations', to: '/student/reclamations', icon: <FolderOpen className="h-5 w-5" /> },
      ]
    : [];

  const renderGroup = (title: string, items: NavItem[]) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-4" key={title}>
        <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{title}</p>
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={() => {
              const active = location.pathname === item.to;
              return `flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm font-medium transition-colors ${
                active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
              }`;
            }}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </div>
    );
  };

  return (
    <nav className="flex flex-col h-full py-4 overflow-y-auto">
      {renderGroup('General', shared)}
      {renderGroup('Admin', admin)}
      {renderGroup('Teacher', teacher)}
      {renderGroup('Student', student)}
    </nav>
  );
}
