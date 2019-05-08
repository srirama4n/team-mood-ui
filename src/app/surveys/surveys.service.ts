import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {URL_PREFIX} from '../common/constants';

@Injectable()
export class SurveysService {

    constructor(private http: HttpClient) {
    }

    retrieveSurveys(): Observable<any> {
        return this.http.get(`${URL_PREFIX}/surveys/all`);
    }

}
