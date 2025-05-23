export interface APIResult<T> {
  isError: boolean;
  message: string;
  result: T;
  isSuccess: boolean;
}
export interface NavItem {
  label: string;
  path: string;
  keywords?: string[];
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  isError: boolean;
  exceptionInformation: unknown;
  value: T;
}

export interface ValidUser {
  odataEtag: string | null;
  email: string;
  contact: string | null;
  assignedUserID: string;
  portalEnabled: boolean;
  isEmployee: boolean;
  personResponsible: string;
}