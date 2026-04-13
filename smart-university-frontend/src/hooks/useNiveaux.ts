import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNiveaux, createNiveau, updateNiveau, deleteNiveau } from '../api/niveauApi';
import type { CreateNiveauDTO } from '../types/niveau';
import toast from 'react-hot-toast';

export function useNiveaux() {
  return useQuery({ queryKey: ['niveaux'], queryFn: getNiveaux });
}

export function useCreateNiveau() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateNiveauDTO) => createNiveau(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['niveaux'] }); toast.success('Niveau created'); },
    onError: () => toast.error('Failed to create niveau'),
  });
}

export function useUpdateNiveau() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateNiveauDTO> }) => updateNiveau(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['niveaux'] }); toast.success('Niveau updated'); },
    onError: () => toast.error('Failed to update niveau'),
  });
}

export function useDeleteNiveau() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteNiveau(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['niveaux'] }); toast.success('Niveau deleted'); },
    onError: () => toast.error('Failed to delete niveau'),
  });
}
