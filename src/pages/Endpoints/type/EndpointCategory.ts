export interface EndpointCategoryModel {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  endpoints?: {
    id?: string;
    name?: string;
    title: string;
    value: string;
  }[];
}
