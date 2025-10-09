import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface IUserQueryParams {
  search?: string;
  limit?: number;
}

const getAllTokens = ({ pageParam = 1, queryKey }: any): Promise<any> => {
  const [, , params] = queryKey;
  return axios.get(`${import.meta.env.VITE_API_URL}/tokens`, {
    params: {
      limit: params?.limit ?? 20,
      page: pageParam,
      search: params?.search ?? "",
    },
  });
};

export const useAllTokens = (params?: IUserQueryParams) => {
  return useInfiniteQuery<any>({
    queryKey: ['tokens', params],
    queryFn: getAllTokens,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage?.data?.data?.length === 0) return undefined;
      return allPages.length + 1; // next page number
    },
    initialPageParam: 1,
  });
};
