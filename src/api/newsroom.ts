import { axiosClient } from '@/configs';
import type { BlogType, BlogsResponseType } from '@/types';

export interface GetAllBlogsProps {
  page?: number;
  limit?: number;
  query?: string;
  orderBy?: string;
  categoryIds?: Array<string>;
}

export interface GetAllCategoriessProps {
  page?: number;
  limit?: number;
  orderBy?: string;
}

export const getAllBlogs = async (params: GetAllBlogsProps) => {
  const { data } = await axiosClient.get<BlogsResponseType>(`/nfa/blogs`, { params });
  return data;
};

/*  Promise<{ items: BlogType[]; nextPage?: number }> => { */
export async function getBlogsByPage({
  pageParam = 1,
  queryParam,
}: {
  pageParam: number;
  queryParam: Omit<GetAllBlogsProps, 'page'>;
}): Promise<{ items: BlogType[]; nextPage?: number }> {
  const { query, limit, orderBy, categoryIds } = queryParam;
  const { data } = await axiosClient.get<BlogsResponseType>(`/nfa/blogs`, {
    params: {
      page: pageParam,
      query,
      limit,
      orderBy,
      categoryIds,
    },
  });
  const { items, pageCount } = data;

  return {
    items: items,
    nextPage: pageCount > pageParam ? pageParam + 1 : undefined,
  };
}

export const getBlogByPath = async (path: string) => {
  const { data } = await axiosClient.get<BlogType>(`/nfa/blogs/get?path=${path}`);
  return data;
};

export const getAllCategories = async (params: GetAllCategoriessProps) => {
  const { data } = await axiosClient.get(`/nfa/categories`, { params });
  return data;
};
