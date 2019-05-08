import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {CreateSurvey} from './create-survey';
import {URL_PREFIX} from '../common/constants';

@Injectable()
export class CreateSurveyService {

    constructor(private http: HttpClient) {
    }

    retrieveGroups(): Observable<any> {
        return this.http.get(`${URL_PREFIX}/groups`);
    }

    retrieveTower(groupId: string): Observable<any> {
        return this.http.get(`${URL_PREFIX}/towers?groupId=${groupId}`);
    }

    retrieveProject(towerId: string): Observable<any> {
        return this.http.get(`${URL_PREFIX}/projects?towerId=${towerId}`);
    }

    retrieveSquad(projectId: string): Observable<any> {
        return this.http.get(`${URL_PREFIX}/squads?projectId=${projectId}`);
    }

    createSurveyLink(data: CreateSurvey): Promise<string> {
        return this.http.post<string>(`${URL_PREFIX}/surveys`, data).toPromise();
    }

    renewSurvey(data): Observable<any> {
        return this.http.post<any>(`${URL_PREFIX}/surveys/renew`, data);
    }

}
