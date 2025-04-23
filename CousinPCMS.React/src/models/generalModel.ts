export interface APIResult<T> {
  isError: boolean;
  message: string;
  result: T;
  isSuccess: boolean;
}
export interface NavItem {
  label: string;
  path: string;
  keywords?: string[]; // optional
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  isError: boolean;
  exceptionInformation: any;
  value: T;
}