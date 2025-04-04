export interface CommodityCode {
    oDataEtag: string;
    commodityCode: string;
    description: string;
  }
  
  export interface CommodityCodeResponse {
    value: CommodityCode[];
    isSuccess: boolean;
    isError: boolean;
    exceptionInformation: any;
  }