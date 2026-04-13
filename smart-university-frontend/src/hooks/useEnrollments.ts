import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEnrollments, getEnrollmentsByStudent, getEnrollmentsByCourse, createEnrollment, cancelEnrollment } from '../api/academicApi';
import type { CreateEnrollmentDTO } from '../types/enrollment';
import toast from 'react-hot-toast';

export function useEnrollments() {
  return useQuery({ queryKey: ['enrollments'], queryFn: getEnrollments });
}

export function useStudentEnrollments(studentId: number | undefined) {
  return useQuery({
    queryKey: ['enrollments', 'student', studentId],
    queryFn: () => getEnrollmentsByStudent(studentId!),
    enabled: studentId !== undefined,
  });
}

export function useEnrollmentsByCourse(courseId: number | undefined) {
  return useQuery({
    queryKey: ['enrollments', 'course', courseId],
    queryFn: () => getEnrollmentsByCourse(courseId!),
    enabled: courseId !== undefined,
  });
}

export function useCreateEnrollment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEnrollmentDTO) => createEnrollment(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['enrollments'] }); toast.success('Enrollment created'); },
    onError: () => toast.error('Failed to create enrollment'),
  });
}

export function useCancelEnrollment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => cancelEnrollment(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['enrollments'] }); toast.success('Enrollment cancelled'); },
    onError: () => toast.error('Failed to cancel enrollment'),
  });
}
