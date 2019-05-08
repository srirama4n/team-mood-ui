import { ITemparature } from "../common/model";

export class ITemparatureReport {
    id?: string;
    createdAt?: string;
    updatedAt?: string;
    expiresOn?: string;
    submissions?: number;
    minTemperature?: number;
    maxTemperature?: number;
    avgTemperature?: number;
    group?: IGroup;
    tower?: ITower;
    project?: IProject;
    squad?: ISquad
    temperatures?: ITemparature[];
}
export class IGroup {
    id?: string;
    name?: string;
}
export class ITower {
    id?: string;
    name?: string;
}
export class IProject {
    id?: string;
    name?: string;
}
export class ISquad {
    id?: string;
    name?: string;
}