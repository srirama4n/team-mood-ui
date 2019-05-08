import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class UserDashboardService {

    constructor(private http: HttpClient) {
    }

    retrieveUser(surveyId): Observable<any> {
        return null;
    }

}
