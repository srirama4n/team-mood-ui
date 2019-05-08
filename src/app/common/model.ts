export class ITemparature {
    id?: string;
    comment?: string;
    rating?: number;
    surveyId?: string;
    count?: number;
    color?: string;
    averageRating?: number;
}

export class ITemparatureCSV {
    no?: number;
    platform?: string;
    team?: string;
    squad?: string;
    minimumTemparature?: number;
    maximumTemparature?: number;
    averageTemparature?: number;
}