import {Component, Input} from "@angular/core";
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-survey-report',
    templateUrl: './survey-report.component.html',
    styleUrls: ['./survey-report.component.css']
})
export class SurveyReportComponent {

    @Input()
    reportDetail:any;

    constructor() {
    }

}
