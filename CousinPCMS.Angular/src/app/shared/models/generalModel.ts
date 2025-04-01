export interface APIResult<T> {
  isError: boolean;
  message: string;
  result: T;
  isSuccess: boolean;
}
export interface NavItem {
  label: string;
  path: string;
}