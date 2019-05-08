import {Component, Inject} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDatepickerInputEvent, MatDialog, MatSnackBar} from "@angular/material";
import {CreateSurveyService} from "./create-survey.service";
import {CreateSurvey, Group, Project, Squad, Tower} from "./create-survey";
import {DOCUMENT} from "@angular/common";
import {Observable} from "rxjs/Rx";
import {AuthenticationDialogComponent} from "../authentication/authentication-dialog.component";
import {CHRACTERS, CREATER_BY} from "../common/constants";
import {isUndefined} from "util";

@Component({
    selector: "app-create-survey",
    templateUrl: "./create-survey.component.html",
    styleUrls: ["./create-survey.component.css"]
})
export class CreateSurveyComponent {

    isLinear = true;
    form: FormGroup;
    groupFormGroup: FormGroup;
    towerFormGroup: FormGroup;
    projectFormGroup: FormGroup;
    squadFormGroup: FormGroup;
    expireDateFormGroup: FormGroup;
    respondentsFormGroup: FormGroup;
    showRenewMessage: boolean;

    $groupOptions;
    $towerOptions;
    $projectOptions;
    $squadOptions;
    createSurvey;
    fillSurveyUrl;
    surveyId;
    linkId;
    expiryDate;
    nextData: Array<string>;
    surveyPassword;

    constructor(private _fb: FormBuilder,
        public snackBar: MatSnackBar,
        public dialog: MatDialog,
        private createSurveyService: CreateSurveyService,
        @Inject(DOCUMENT) document: any) {
    }

    ngOnInit() {

        this.groupFormGroup = this._fb.group({
            groupName: ['', Validators.required]
        });
        this.towerFormGroup = this._fb.group({
            towerName: ['', Validators.required]
        });
        this.projectFormGroup = this._fb.group({
            projectName: ['', Validators.required]
        });
        this.squadFormGroup = this._fb.group({
            squadName: ['', Validators.required]
        });
        this.expireDateFormGroup = this._fb.group({
            expDate: ['', Validators.required]
        });
        this.respondentsFormGroup = this._fb.group({
            respondents: ['', Validators.required]
        });

        this.form = this._fb.group({
            group: this.groupFormGroup,
            tower: this.towerFormGroup,
            project: this.projectFormGroup,
            squad: this.squadFormGroup,
            expire: this.expireDateFormGroup,
            respondents: this.respondentsFormGroup
        });
        this.$groupOptions = this.createSurveyService.retrieveGroups();
        this.createSurvey = new CreateSurvey();
        this.nextData = new Array<string>();
    }

    openLoginDailog() {
        let dialogRef = this.dialog.open(AuthenticationDialogComponent, {
            width: "240px",
            data: { title: "Register for Survey", buttonName: "Create Survey", showClose: "false", name: undefined, password: undefined },
            panelClass: "my-panel",
            autoFocus: true,
            disableClose: true,
        });

        dialogRef.afterClosed().subscribe(data => {
            if (!!data && !!data.name && !!data.password) {
                this.createSurvey.createdBy = data.name;
                this.createSurvey.key = data.password;
            }
        });
    }

    next(message: string, isInValid) {
        isInValid && this.snackBar.open(message, 'Close', { duration: 3000 });
    }

    updateHeader(key, value) {
        for (let i = key; i < this.nextData.length; i++) {
            this.nextData[i] = '';
            switch (key) {
                case 0:
                    this.form.get('project').reset();
                    this.form.get('squad').reset();
                    this.form.get('expire').reset();
                    this.form.get('respondents').reset();
                case 1:
                    this.form.get('project').reset();
                    this.form.get('squad').reset();
                    this.form.get('expire').reset();
                    this.form.get('respondents').reset();
                case 2:
                    this.form.get('squad').reset();
                    this.form.get('expire').reset();
                    this.form.get('respondents').reset();
                case 3:
                    this.form.get('expire').reset();
                    this.form.get('respondents').reset();
                case 4:
                    this.form.get('respondents').reset();
            }
        }
        this.nextData[key] = value;
    }

    onGroupChange(id, name) {
        this.$towerOptions = Observable.of([]);
        this.$projectOptions = Observable.of([]);
        this.$squadOptions = Observable.of([]);

        this.createSurvey.group = new Group(id, name);
        if (!!id) {
            this.$towerOptions = this.createSurveyService.retrieveTower(id);
        }
    }

    onTowerChange(id, name) {
        this.createSurvey.tower = new Tower(id, name);
        if (!!id) {
            this.$projectOptions = this.createSurveyService.retrieveProject(id);

        }
    }

    onProjectChange(id, name) {
        this.createSurvey.project = new Project(id, name);
        if (!!id) {
            this.$squadOptions = this.createSurveyService.retrieveSquad(id);
        }
    }

    onSquadChange(id, name) {
        this.createSurvey.squad = new Squad(id, name);
    }

    onDateChange(event: MatDatepickerInputEvent<Date>) {
        let localeDateString = event.value.toLocaleDateString();
        let date = new Date(localeDateString);
        date.setDate(date.getDate() + 1);
        this.createSurvey.expiresOn = date.toISOString();
    }

    onRespondentsChange(respondents) {
        if (isUndefined(respondents)) {
            return;
        }
        const reg = /^\d+$/;
        if (reg.test(respondents)) {
            // only numbers.
            this.createSurvey.respondents = respondents;
        } else {
            this.next('Please fill a number for no. of respondents', true);
        }
    }

    generateURL() {
        const password = this.keyGen(10);
        this.createSurvey.createdBy = CREATER_BY;
        this.createSurvey.key = password;
        this.form.valid && this.createSurveyService.createSurveyLink(this.createSurvey)
            .then(data => {
                this.showRenewMessage = false;
                this.surveyId = data["id"];
                this.linkId = data["linkId"];
                this.expiryDate = data["expiresOn"];
                this.fillSurveyUrl = `${document.location.origin}/fill/survey/${data["linkId"]}`;
                this.surveyPassword = password;
            })
            .catch(error => {
                console.log('Error while creating a survey : ' + error['message']);
                this.showRenewMessage = true;
            });

    }

    expiryDateFilter = (d: Date): boolean => {
        const day = d.getDay();
        const pastDate = new Date();
        return day !== 0 && day !== 6 && (d >= pastDate);
    };

    keyGen(keyLength) {
        let i, key = "";
        let charactersLength = CHRACTERS.length;
        for (i = 0; i < keyLength; i++) {
            key += CHRACTERS.substr(Math.floor((Math.random() * charactersLength) + 1), 1);
        }
        return key;
    }

    resetNextData() {
        this.nextData = new Array<string>();
    }

}