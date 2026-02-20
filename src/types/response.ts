export interface ResponseInterface<T> {
  data: T[];
  total: number;
  skip: number;
  limit: number;
}
