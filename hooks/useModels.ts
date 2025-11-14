import { useQuery } from '@tanstack/react-query';
import { modelsService, ModelData } from '@/services/models';

export const useModels = () => {
  return useQuery({
    queryKey: ['models'],
    queryFn: modelsService.getModels,
    staleTime: 1000 * 60 * 10, // 10 minutes
    cacheTime: 1000 * 60 * 60, // 1 hour
    retry: 2,
  });
};

export const useModelById = (id: number | null) => {
  return useQuery({
    queryKey: ['model', id],
    queryFn: () => modelsService.getModelById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
    cacheTime: 1000 * 60 * 60, // 1 hour
    retry: 2,
  });
};