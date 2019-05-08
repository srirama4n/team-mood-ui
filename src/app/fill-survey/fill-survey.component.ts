import { Component, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { FillSurveyService } from './fill-survey.service';
import { CreateSurvey } from '../create-survey/create-survey';
import { FillSurvey } from './fill-survey';
import { UUID } from "angular2-uuid";

@Component({
    selector: 'app-fill-survey',
    templateUrl: './fill-survey.component.html',
    styleUrls: ['./fill-survey.component.css']
})
export class FillSurveyComponent {

    form: FormGroup;
    surveyId: string;
    surveyDetail: CreateSurvey;
    localTemperature: any;
    isSubmitted: boolean;
    isExpired: boolean;

    constructor(@Inject('LOCALSTORAGE') private localStorage: any,
        private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        public snackBar: MatSnackBar,
        public fillSurveyService: FillSurveyService) {
    }

    ngOnInit() {
        this.isSubmitted = false;
        this.form = this._fb.group({
            temperature: ['', Validators.required],
            description: ['', Validators.required]
        });

        this.route.params.subscribe(params => {
            const linkId = params['id'];
            this.populateSurveyDetail(linkId);
        });
    }

    updateForm() {
        this.localTemperature = this.localStorage.getItem(this.surveyId);
        if (!!this.localTemperature) {
            const existingTemp = JSON.parse(this.localTemperature);
            this.form.controls.temperature.reset(existingTemp['rating']);
            this.form.controls.description.reset(existingTemp['comment']);
        }
    }

    populateSurveyDetail(linkId: string) {
        this.fillSurveyService.retrieveSurveyDetailsByLink(linkId)
            .subscribe(data => {
                this.surveyDetail = data;
                this.isExpired = new Date(data["expiresOn"]) >= new Date();
                this.surveyId = data['id'];
                this.updateForm();
            });
    }

    submit() {
        this.isSubmitted = true;
        this.localTemperature = this.localStorage.getItem(this.surveyId);
        console.log(this.localTemperature);
        if (this.form.controls.temperature.valid && this.form.controls.description.valid) {
            const temperature = this.form.controls.temperature.value;
            let comment: string = (<string>this.form.controls.description.value).trim();
            let fillSurvey;
            if (!!this.localTemperature) {
                fillSurvey = new FillSurvey(JSON.parse(this.localTemperature)['id'], temperature, comment, this.surveyId);
            } else {
                let uuid = UUID.UUID();
                fillSurvey = new FillSurvey(uuid, temperature, comment, this.surveyId);
            }
            this.localStorage.setItem(this.surveyId, JSON.stringify(fillSurvey));

            this.fillSurveyService.submitSurvey(fillSurvey)
                .subscribe(data => {
                    this.isSubmitted = false;
                    this.snackBar.open('Thank you for submitting your answers. You can amend them now or later using this browser only if you need to.', 'Close', { duration: 3000 });
                });
        } else {
            this.snackBar.open('Please fill valid data', 'Close', { duration: 3000 });
        }
    }

}
