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
    lastModifiedDateTime: string; // Use 'Date' if you plan to parse it
    countyName: string;

}
export interface CountryResponse {
    value: Country[]; // Array of Country objects
    isSuccess: boolean;
    isError: boolean;
    exceptionInformation: any; // Change type if more details are available
}