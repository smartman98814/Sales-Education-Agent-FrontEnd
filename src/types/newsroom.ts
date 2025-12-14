export type RequestType = {
  query?: string;
  page?: number;
  limit?: number;
  orderBy?: string;
};

export type ResponseType = {
  page: number;
  limit: number;
  pageCount: number;
  totalCount: number;
};

export interface NewsroomParams {
  searchParams?: {
    page?: string;
    query?: string;
    category?: string[];
    orderDirection?: string;
  };
}

export type BlogsRequestType = RequestType & {
  title?: string;
  content?: string;
  categoryIds?: string[];
};

export type BlogType = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  metaData: {
    image: string;
    description: string;
  };
  path: string;
  createdAt: string;
  categories: CategoryType[];
};

export type CategoryType = {
  id: string;
  name: string;
};

export type AuthorType = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type CategoriesRequestType = RequestType & {
  name?: string;
  status?: string;
};

export type BlogsResponseType = ResponseType & {
  items: BlogType[];
};

export type CategoriesResponseType = ResponseType & {
  items: CategoryType[];
};
