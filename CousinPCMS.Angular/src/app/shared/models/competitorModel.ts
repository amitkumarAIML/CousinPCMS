export interface CompetitorItem {
    oDataEtag: string;
    akiItemId: string;
    akiCompetitorID: number;
    akiCompetitorName: string;
}

  
export interface CompetitorItemResponse {
    value: CompetitorItem[];
    isSuccess: boolean;
    isError: boolean;
    exceptionInformation: any;
}