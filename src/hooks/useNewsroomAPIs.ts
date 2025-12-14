import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import _ from 'lodash';

import { GetAllBlogsProps, getAllBlogs, getAllCategories, getBlogsByPage } from '@/api/newsroom';

export const useBlogsQuery = (params: GetAllBlogsProps) => {
  return useQuery({
    queryKey: ['blogs', 'list', params],
    queryFn: () => getAllBlogs(params),
  });
};

export function useBlogsInfiniteQuery(params: GetAllBlogsProps) {
  return useInfiniteQuery({
    queryKey: ['blogs', 'list', params],
    queryFn: ({ pageParam }) =>
      getBlogsByPage({
        pageParam,
        queryParam: _.omit(params, ['page']),
      }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: params.page ?? 1,
  });
}

export const useBlogCategories = () => {
  return useQuery({
    queryKey: ['blogs', 'categories'],
    queryFn: () => getAllCategories({}),
  });
};
