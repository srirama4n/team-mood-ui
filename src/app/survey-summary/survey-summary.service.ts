import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {URL_PREFIX} from '../common/constants';

@Injectable()
export class SurveySummaryService {

    constructor(private http: HttpClient) {
    }

    retrieveSurveySummary(surveyId): Observable<any> {
        let url2 = URL_PREFIX + '/surveys/' + surveyId + '/summary';
        return this.http.get(url2);
    }

}
