import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './auth/useAuth';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { Layout } from './components/Layout';
import { Spinner } from './components/Spinner';

import Dashboard from './pages/shared/Dashboard';
import Profile from './pages/shared/Profile';
import Unauthorized from './pages/shared/Unauthorized';

import UserManagement from './pages/admin/UserManagement';
import CourseManagement from './pages/admin/CourseManagement';
import NiveauManagement from './pages/admin/NiveauManagement';
import ClasseManagement from './pages/admin/ClasseManagement';
import EnrollmentManagement from './pages/admin/EnrollmentManagement';
import GradeManagement from './pages/admin/GradeManagement';
import ReclamationManagement from './pages/admin/ReclamationManagement';

import GradeEntry from './pages/teacher/GradeEntry';
import GradeList from './pages/teacher/GradeList';
import ClassRoster from './pages/teacher/ClassRoster';
import CourseList from './pages/teacher/CourseList';
import ReclamationInbox from './pages/teacher/ReclamationInbox';

import MyGrades from './pages/student/MyGrades';
import MyCourses from './pages/student/MyCourses';
import MyClasse from './pages/student/MyClasse';
import SubmitReclamation from './pages/student/SubmitReclamation';
import MyReclamations from './pages/student/MyReclamations';

export default function App() {
  const { initialized } = useAuth();

  if (!initialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Admin routes */}
        <Route path="/admin/users" element={<ProtectedRoute roles={['ADMIN']}><UserManagement /></ProtectedRoute>} />
        <Route path="/admin/courses" element={<ProtectedRoute roles={['ADMIN']}><CourseManagement /></ProtectedRoute>} />
        <Route path="/admin/niveaux" element={<ProtectedRoute roles={['ADMIN']}><NiveauManagement /></ProtectedRoute>} />
        <Route path="/admin/classes" element={<ProtectedRoute roles={['ADMIN']}><ClasseManagement /></ProtectedRoute>} />
        <Route path="/admin/enrollments" element={<ProtectedRoute roles={['ADMIN']}><EnrollmentManagement /></ProtectedRoute>} />
        <Route path="/admin/grades" element={<ProtectedRoute roles={['ADMIN']}><GradeManagement /></ProtectedRoute>} />
        <Route path="/admin/reclamations" element={<ProtectedRoute roles={['ADMIN']}><ReclamationManagement /></ProtectedRoute>} />

        {/* Teacher routes */}
        <Route path="/teacher/grade-entry" element={<ProtectedRoute roles={['TEACHER']}><GradeEntry /></ProtectedRoute>} />
        <Route path="/teacher/grades" element={<ProtectedRoute roles={['TEACHER']}><GradeList /></ProtectedRoute>} />
        <Route path="/teacher/roster" element={<ProtectedRoute roles={['TEACHER']}><ClassRoster /></ProtectedRoute>} />
        <Route path="/teacher/courses" element={<ProtectedRoute roles={['TEACHER']}><CourseList /></ProtectedRoute>} />
        <Route path="/teacher/reclamations" element={<ProtectedRoute roles={['TEACHER']}><ReclamationInbox /></ProtectedRoute>} />

        {/* Student routes */}
        <Route path="/student/grades" element={<ProtectedRoute roles={['STUDENT']}><MyGrades /></ProtectedRoute>} />
        <Route path="/student/courses" element={<ProtectedRoute roles={['STUDENT']}><MyCourses /></ProtectedRoute>} />
        <Route path="/student/classe" element={<ProtectedRoute roles={['STUDENT']}><MyClasse /></ProtectedRoute>} />
        <Route path="/student/reclamation/new" element={<ProtectedRoute roles={['STUDENT']}><SubmitReclamation /></ProtectedRoute>} />
        <Route path="/student/reclamations" element={<ProtectedRoute roles={['STUDENT']}><MyReclamations /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
}
