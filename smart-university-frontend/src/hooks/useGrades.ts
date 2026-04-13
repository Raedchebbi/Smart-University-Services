import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGrades, getStudentGrades, createGrade, updateGrade, getGradeAverage, getGradeMax, getGradeMin, getGradeCount } from '../api/gradeApi';
import type { CreateGradeDTO } from '../types/grade';
import toast from 'react-hot-toast';

export function useGrades() {
  return useQuery({ queryKey: ['grades'], queryFn: getGrades, staleTime: 1000 * 60 * 2 });
}

export function useStudentGrades(studentName: string | undefined) {
  return useQuery({
    queryKey: ['grades', 'student', studentName],
    queryFn: () => getStudentGrades(studentName!),
    enabled: !!studentName,
    staleTime: 1000 * 60 * 2,
  });
}

export function useGradeStats() {
  const avg = useQuery({ queryKey: ['grades', 'avg'], queryFn: getGradeAverage });
  const max = useQuery({ queryKey: ['grades', 'max'], queryFn: getGradeMax });
  const min = useQuery({ queryKey: ['grades', 'min'], queryFn: getGradeMin });
  const count = useQuery({ queryKey: ['grades', 'count'], queryFn: getGradeCount });
  return { avg, max, min, count };
}

export function useCreateGrade() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateGradeDTO) => createGrade(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['grades'] }); toast.success('Grade created'); },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to create grade';
      toast.error(msg);
    },
  });
}

export function useUpdateGrade() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateGradeDTO }) => updateGrade(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['grades'] }); toast.success('Grade updated'); },
    onError: () => toast.error('Failed to update grade'),
  });
}
