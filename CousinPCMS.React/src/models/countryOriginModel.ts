export interface Country {
  oDataEtag: string;
  code: string;
  name: string;
  isoCode: string;
  isoNumericCode: string;
  euCountryRegionCode: string;
  intrastatCode: string;
  addressFormat: string;
  contactAddressFormat: string;
  vatScheme: string;
  lastModifiedDateTime: string;
  countyName: string;
}
export interface CountryResponse {
  value: Country[];
  isSuccess: boolean;
  isError: boolean;
  exceptionInformation: unknown;
}
