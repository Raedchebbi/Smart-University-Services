import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateGrade } from '../../hooks/useGrades';
import { useCourses } from '../../hooks/useCourses';
import { useUsers } from '../../hooks/useUsers';
import { useEnrollmentsByCourse } from '../../hooks/useEnrollments';
import { useAuth } from '../../auth/useAuth';
import { Spinner } from '../../components/Spinner';

const gradeSchema = z.object({
  score: z.coerce.number().min(0, 'Min 0').max(20, 'Max 20'),
  semester: z.string().min(1, 'Select a semester'),
  examType: z.string().min(1, 'Select an exam type'),
});
type GradeForm = z.infer<typeof gradeSchema>;

export default function GradeEntry() {
  const { username } = useAuth();
  const createMut = useCreateGrade();
  const { data: courses, isLoading: coursesLoading } = useCourses();
  const { data: users } = useUsers();

  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');

  // Find the logged-in teacher's user-service record by matching Keycloak username
  const myUser = useMemo(() =>
    users?.find((u) => u.name.toLowerCase().replace(/\s+/g, '.') === username),
    [users, username],
  );

  // Only courses assigned to this teacher
  const myCourses = useMemo(() =>
    courses?.filter((c) => myUser && c.professorId === myUser.id) ?? [],
    [courses, myUser],
  );

  const selectedCourseIdNum = selectedCourseId ? Number(selectedCourseId) : undefined;
  const { data: enrollments, isLoading: enrollmentsLoading } = useEnrollmentsByCourse(selectedCourseIdNum);

  // Enrolled students for the selected course
  const enrolledStudents = useMemo(() => {
    if (!enrollments || !users) return [];
    return enrollments
      .filter((e) => e.status !== 'CANCELLED')
      .map((e) => {
        const user = users.find((u) => u.id === e.studentId);
        return {
          id: e.studentId,
          name: user?.name ?? `Student #${e.studentId}`,
          username: user ? user.name.toLowerCase().replace(/\s+/g, '.') : `student-${e.studentId}`,
        };
      });
  }, [enrollments, users]);

  const selectedCourse = courses?.find((c) => String(c.id) === selectedCourseId);
  const selectedStudent = enrolledStudents.find((s) => String(s.id) === selectedStudentId);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<GradeForm>({ resolver: zodResolver(gradeSchema) });

  const watchScore = watch('score');
  const watchSemester = watch('semester');

  const resetForm = () => { setSelectedCourseId(''); setSelectedStudentId(''); reset(); };

  const onSubmit = (vals: GradeForm) => {
    createMut.mutate(
      {
        studentName: selectedStudent?.username ?? '',
        subject: selectedCourse?.title ?? '',
        examType: vals.examType,
        semester: vals.semester,
        score: vals.score,
      },
      { onSuccess: resetForm },
    );
  };

  return (
    <div className="max-w-lg mx-auto">
      <nav className="text-xs text-gray-400 mb-2">Dashboard &gt; Add Grade</nav>
      <h1 className="text-2xl font-bold mb-6">Add Grade</h1>
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="space-y-4">
          {/* Step 1: Pick course (only teacher's courses) */}
          <div>
            <label className="block text-sm font-medium mb-1">My Course</label>
            {coursesLoading ? <Spinner size="sm" /> : myCourses.length === 0 ? (
              <p className="text-sm text-amber-600">No courses assigned to you. Ask an admin to set you as professor on a course.</p>
            ) : (
              <select
                value={selectedCourseId}
                onChange={(e) => { setSelectedCourseId(e.target.value); setSelectedStudentId(''); }}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select your course</option>
                {myCourses.map((c) => <option key={c.id} value={String(c.id)}>{c.title} ({c.credits} credits)</option>)}
              </select>
            )}
          </div>

          {/* Step 2: Pick student (only enrolled in the selected course) */}
          {selectedCourseId && (
            <div>
              <label className="block text-sm font-medium mb-1">Student (enrolled)</label>
              {enrollmentsLoading ? <Spinner size="sm" /> : enrolledStudents.length === 0 ? (
                <p className="text-sm text-amber-600">No students enrolled in this course yet.</p>
              ) : (
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select a student</option>
                  {enrolledStudents.map((s) => <option key={s.id} value={String(s.id)}>{s.name} ({s.username})</option>)}
                </select>
              )}
            </div>
          )}
        </div>

        {selectedCourseId && selectedStudentId && (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4 border-t pt-4">
            {selectedCourse && selectedStudent && (
              <div className="rounded-lg bg-indigo-50 p-3 text-sm text-indigo-700">
                Grading <strong>{selectedStudent.name}</strong> for <strong>{selectedCourse.title}</strong>
                {watchScore !== undefined && ` — ${watchScore}/20`}
                {watchSemester && ` (${watchSemester})`}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Exam Type</label>
              <select {...register('examType')} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Select exam type</option>
                <option value="Midterm">Midterm</option>
                <option value="Final">Final</option>
                <option value="Quiz">Quiz</option>
              </select>
              {errors.examType && <p className="text-red-500 text-xs mt-1">{errors.examType.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Grade (0–20)</label>
              <input {...register('score')} type="number" step="0.5" min="0" max="20" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              {errors.score && <p className="text-red-500 text-xs mt-1">{errors.score.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Semester</label>
              <select {...register('semester')} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Select semester</option>
                <option value="S1">S1</option>
                <option value="S2">S2</option>
              </select>
              {errors.semester && <p className="text-red-500 text-xs mt-1">{errors.semester.message}</p>}
            </div>

            <button type="submit" disabled={createMut.isPending} className="w-full py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-sm font-medium flex items-center justify-center gap-2">
              {createMut.isPending && <Spinner size="sm" />}
              {createMut.isPending ? 'Saving…' : 'Save Grade'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
