import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCourses, createCourse, updateCourse, deleteCourse } from '../api/academicApi';
import type { CreateCourseDTO } from '../types/course';
import toast from 'react-hot-toast';

export function useCourses() {
  return useQuery({ queryKey: ['courses'], queryFn: getCourses, staleTime: 1000 * 60 * 2 });
}

export function useCreateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCourseDTO) => createCourse(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['courses'] }); toast.success('Course created'); },
    onError: () => toast.error('Failed to create course'),
  });
}

export function useUpdateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateCourseDTO }) => updateCourse(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['courses'] }); toast.success('Course updated'); },
    onError: () => toast.error('Failed to update course'),
  });
}

export function useDeleteCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCourse(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['courses'] }); toast.success('Course deleted'); },
    onError: () => toast.error('Failed to delete course'),
  });
}
