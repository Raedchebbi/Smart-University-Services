import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getReclamations, getStudentReclamations, createReclamation } from '../api/reclamationApi';
import type { CreateReclamationDTO } from '../types/reclamation';
import toast from 'react-hot-toast';

export function useReclamations() {
  return useQuery({ queryKey: ['reclamations'], queryFn: getReclamations, staleTime: 1000 * 60 * 2 });
}

export function useStudentReclamations(username: string | undefined) {
  return useQuery({
    queryKey: ['reclamations', 'student', username],
    queryFn: () => getStudentReclamations(username!),
    enabled: !!username,
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateReclamation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReclamationDTO) => createReclamation(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['reclamations'] }); toast.success('Reclamation submitted'); },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to submit reclamation';
      toast.error(msg);
    },
  });
}
