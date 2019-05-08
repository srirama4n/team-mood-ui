import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { URL_PREFIX } from '../common/constants';

@Injectable()
export class ViewSurveysService {

    constructor(private http: HttpClient) {
    }

    retrieveSurveysBySquadName(name: string, projectName: string): Observable<any> {
        return this.http.get(`${URL_PREFIX}/surveys/squad?name=${name}&projectName=${projectName}`);
    }

}
