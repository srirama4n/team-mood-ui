import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {FillSurveyService} from '../fill-survey/fill-survey.service';

@Injectable()
export class FillSurveyGuard implements CanActivate {

    constructor(private router: Router, public fillSurveyService: FillSurveyService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.fillSurveyService.retrieveSurveyDetailsByLink(route.params["id"])
            .map(data => {
                const isNotExpired: boolean = new Date(data["expiresOn"]) >= new Date();
                if (isNotExpired) {
                    return true;
                } else {
                    this.router.navigate([`summary/${data["id"]}`]);
                    return false;
                }
            });
    }
}