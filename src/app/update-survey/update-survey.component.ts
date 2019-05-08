import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateSurvey } from '../create-survey/create-survey';
import { UpdateSurveyService } from './update-survey.service';
import { AuthenticationDialogComponent } from '../authentication/authentication-dialog.component';
import { CREATER_BY } from "../common/constants";

@Component({
    selector: 'app-update-survey',
    templateUrl: './update-survey.component.html',
    styleUrls: ['./update-survey.component.css']
})
export class UpdateSurveyComponent {

    form: FormGroup;
    surveyId: string;
    surveyDetail: CreateSurvey;
    isSubmitted: boolean;
    isExpired: boolean;

    checked = false;
    indeterminate = false;
    align = 'start';

    constructor(private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        public snackBar: MatSnackBar,
        public dialog: MatDialog,
        public updateSurveyService: UpdateSurveyService) {
    }

    ngOnInit() {
        this.isSubmitted = false;
        this.form = this._fb.group({
            createdDate: [{ value: '', disabled: true }, Validators.required],
            expDate: [{ value: '', disabled: true }, Validators.required],
            respondents: [{ value: '' }, Validators.required]
        });

        this.route.params.subscribe(params => {
            const survyeId = params['id'];
            this.populateSurveyDetail(survyeId);
        });
    }


    populateSurveyDetail(surveyId: string) {
        this.updateSurveyService.retrieveSurveyDetails(surveyId)
            .subscribe(data => {
                this.surveyDetail = data;
                this.isExpired = new Date(data['expiresOn']) >= new Date();
                this.surveyId = data['id'];
                this.form.controls.createdDate.reset(new Date(data['createdAt']));
                this.form.controls.expDate.reset(new Date(data['expiresOn']));
                this.form.controls.respondents.reset(data['respondents']);
            });
    }

    createDateFilter = (d: Date): boolean => {
        const day = d.getDay();
        const pastDate = new Date();
        return day !== 0 && day !== 6 && (d < pastDate);
    };

    expiryDateFilter = (d: Date): boolean => {
        const day = d.getDay();
        const pastDate = new Date();
        return day !== 0 && day !== 6 && (d >= pastDate);
    };

    onCreateDateChange(event) {
        console.log('event', event.value);
    }

    onExpiryDateChange(event) {
        console.log('event', event.value);
    }

    update() {
        this.isSubmitted = true;
        let dialogRef = this.dialog.open(AuthenticationDialogComponent, {
            width: '240px',
            data: { title: 'Login', buttonName: 'Update', name: undefined, password: undefined },
            panelClass: 'my-panel',
            autoFocus: true
        });

        dialogRef.afterClosed().subscribe(data => {
            this.isSubmitted = false;
            if (!!data && !!data.password) {
                const updateRequestData = {
                    id: this.surveyId,
                    createdBy: CREATER_BY,
                    key: data.password,
                    createdAt: this.convert(this.form.controls.createdDate.value),
                    expiresOn: this.convert(this.form.controls.expDate.value),
                    respondents: this.form.controls.respondents.value
                };
                this.updateSurveyService.updateSurvey(updateRequestData).subscribe(response => {
                    if (response.status == 200) {
                        this.router.navigate([`admin/surveys`]);
                    }
                    this.snackBar.open(response.message, 'Close', { duration: 3000 });
                });
            } else {
                this.snackBar.open('Password is invalid.', 'Close', { duration: 3000 });
            }
        });
    }

    delete() {
        this.isSubmitted = true;
        let dialogRef = this.dialog.open(AuthenticationDialogComponent, {
            width: '240px',
            data: { title: 'Login', buttonName: 'Delete', name: undefined, password: undefined },
            panelClass: 'my-panel',
            autoFocus: true
        });

        dialogRef.afterClosed().subscribe(data => {
            this.isSubmitted = false;
            if (!!data && !!data.password) {
                const deleteRequestData = {
                    id: this.surveyId,
                    createdBy: CREATER_BY,
                    key: data.password
                };
                this.updateSurveyService.deleteSurvey(deleteRequestData).subscribe(response => {
                    if (response.status == 200) {
                        this.router.navigate([`admin/surveys`]);
                    }
                    this.snackBar.open(response.message, 'Close', { duration: 3000 });
                });
            } else {
                this.snackBar.open('Password is invalid.', 'Close', { duration: 3000 });
            }
        });
    }

    convert(data) {
        let localeDateString = data.toLocaleDateString();
        let date = new Date(localeDateString);
        date.setDate(date.getDate() + 1);
        return date.toISOString();
    }
}
