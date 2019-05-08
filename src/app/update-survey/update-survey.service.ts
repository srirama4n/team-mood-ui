import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {HttpClient} from "@angular/common/http";
import {URL_PREFIX} from "../common/constants";

@Injectable()
export class UpdateSurveyService {

    constructor(private http: HttpClient) {
    }

    retrieveSurveyDetails(surveyId): Observable<any> {
        return this.http.get(URL_PREFIX + '/surveys?surveyId=' + surveyId);
    }

    retrieveSurveyDetailsByLink(linkId): Observable<any> {
        return this.http.get(URL_PREFIX + '/surveys/link?linkId=' + linkId);
    }

    updateSurvey(data): Observable<any> {
        return this.http.put(URL_PREFIX + '/surveys/update', data);
    }

    deleteSurvey(data): Observable<any> {
        return this.http.put(URL_PREFIX + '/surveys/delete', data);
    }

}
