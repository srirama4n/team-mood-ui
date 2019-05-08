import {Component, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';
import {SurveysService} from './surveys.service';
import {CreateSurveyService} from '../create-survey/create-survey.service';
import {Router} from '@angular/router';
import {AuthenticationDialogComponent} from '../authentication/authentication-dialog.component';
import {UpdateSurveyService} from '../update-survey/update-survey.service';
import {CREATER_BY} from "../common/constants";

@Component({
    selector: 'app-surveys',
    templateUrl: './surveys.component.html',
    styleUrls: ['./surveys.component.css']
})
export class SurveysComponent {
    displayedColumns = ['no', 'name', 'createdAt', 'expiresOn', 'surveyId', 'summaryId', 'renew', 'update'];
    dataSource: MatTableDataSource<Element> = new MatTableDataSource();
    surveyIdMap = {}; // <surveyId, Survey>
    squadNameMap = {}; // <squad_name, Survey>
    elementData: Element[] = [];
    isSubmitted: boolean;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private surveysService: SurveysService,
                public snackBar: MatSnackBar,
                private router: Router,
                public dialog: MatDialog,
                public updateSurveyService: UpdateSurveyService,
                private createSurveyService: CreateSurveyService) {
    }

    ngOnInit() {
        this.isSubmitted = false;
        this.populateTableData();
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
    }


    renew(survey) {
        if (new Date(survey.expiresOn) > new Date()) {
            this.isSubmitted = false;
            this.snackBar.open(`Your survey is not yet expired. Please renew it after Expiry `, 'Close', {duration: 3000});
        } else {
            this.isSubmitted = true;
            let dialogRef = this.dialog.open(AuthenticationDialogComponent, {
                width: '240px',
                data: {title: 'Login', buttonName: 'Renew', name: undefined, password: undefined},
                panelClass: 'my-panel',
                autoFocus: true
            });

            dialogRef.afterClosed().subscribe(data => {
                this.isSubmitted = false;
                if (!!data && !!data.password) {
                    const renewSurveyData = {
                        id: survey.surveyId,
                        createdBy: CREATER_BY,
                        key: data.password,
                    };
                    this.createSurveyService.renewSurvey(renewSurveyData)
                        .subscribe(response => {
                            if (response.status == 200) {
                                this.snackBar.open(response.message, 'Close', {duration: 3000});
                                this.populateTableData();
                            }
                            this.snackBar.open(response.message, 'Close', {duration: 3000});
                        });
                } else {
                    this.snackBar.open('Password is invalid.', 'Close', {duration: 3000});
                }
            });
        }

    }

    update(survey) {
        this.isSubmitted = true;
        let dialogRef = this.dialog.open(AuthenticationDialogComponent, {
            width: '240px',
            data: {title: 'Login', buttonName: 'Update', name: undefined, password: undefined},
            panelClass: 'my-panel',
            autoFocus: true
        });

        dialogRef.afterClosed().subscribe(data => {
            this.isSubmitted = false;
            if (!!data && !!data.password) {
                this.router.navigate([`/admin/survey/${survey['surveyId']}`]);
            } else {
                this.snackBar.open('Password is invalid.', 'Close', {duration: 3000});
            }
        });

    }

    delete(survey) {
        this.isSubmitted = true;
        let dialogRef = this.dialog.open(AuthenticationDialogComponent, {
            width: '240px',
            data: {title: 'Login to Delete', buttonName: 'Delete', name: undefined, password: undefined},
            panelClass: 'my-panel',
            autoFocus: true
        });

        dialogRef.afterClosed().subscribe(data => {
            this.isSubmitted = false;
            if (!!data  && !!data.password) {
                const deleteRequestData = {
                    id: survey.surveyId,
                    createdBy: CREATER_BY,
                    key: data.password
                };
                this.updateSurveyService.deleteSurvey(deleteRequestData).subscribe(response => {
                    if (response.status == 200) {
                        this.populateTableData();
                    }
                    this.snackBar.open(response.message, 'Close', {duration: 3000});
                });
            } else {
                this.snackBar.open('Password is invalid.', 'Close', {duration: 3000});
            }
        });
    }

    onCreatedAtChange(selectedSurveyId, surveyId, number, squadName) {
        console.log('onCreatedAtChange:  ' + selectedSurveyId + ' , surveyId: ' + surveyId);
        console.log('this.squadNameMap[squadName][0].id : ' + this.squadNameMap[squadName][0].id);
        let indexToReplace = 0;
        this.elementData.forEach((survey, index) => {
            if (surveyId === survey.surveyId) {
                indexToReplace = index;
                return;
            }
        });
        let survey = this.surveyIdMap[selectedSurveyId];
        this.elementData[indexToReplace] = {
            no: number,
            name: survey.squad.name,
            createdAt: survey.createdAt,
            expiresOn: survey.expiresOn,
            surveyId: survey.id,
            summaryId: survey.id,
            surveyLinkId: survey.surveyLinkId,
            enableRenew: (new Date(survey.expiresOn) <= new Date()) && (!!survey.linkId)
        };
        this.dataSource.data = this.elementData;
    }

    getCreatedAt(surveyId) {
        return this.surveyIdMap[surveyId].createdAt;
    }

    getSurveys(squadName) {
        return this.squadNameMap[squadName];
    }


    private populateTableData() {
        this.surveysService.retrieveSurveys().subscribe(data => {
            this.dataSource.data = [];
            this.elementData = [];
            data.forEach((survey, index) => {
                /* this.surveyIdMap[survey.id] = survey;
                 if (this.squadNameMap[survey.squad.name]) {
                     this.squadNameMap[survey.squad.name].push(survey);
                 } else {
                     this.squadNameMap[survey.squad.name] = [survey];
                 }
                 let sameSquad = false;
                 this.elementData.forEach((element: Element) => {
                     if (element.name === survey.squad.name) {
                         sameSquad = true;
                     }
                 });
                 if (!sameSquad) {
                     this.elementData.push({
                         no: index + 1,
                         name: survey.squad.name,
                         createdAt: survey.createdAt,
                         expiresOn: survey.expiresOn,
                         surveyId: survey.id,
                         summaryId: survey.id,
                         surveyLinkId: survey.linkId,
                         enableRenew: (new Date(survey.expiresOn) <= new Date()) && (!!survey.linkId)
                     });
                 }*/
                this.elementData.push({
                    no: index + 1,
                    name: survey.squad.name,
                    createdAt: survey.createdAt,
                    expiresOn: survey.expiresOn,
                    surveyId: survey.id,
                    summaryId: survey.id,
                    surveyLinkId: survey.linkId,
                    enableRenew: (!!survey.linkId)
                });
            });

            if (this.elementData !== []) {
                this.dataSource.data = this.elementData;
                this.dataSource.paginator = this.paginator;
            }
        });
    }
}

export interface Element {
    no: number;
    name: string;
    createdAt: string;
    expiresOn: string;
    surveyId: string;
    summaryId: string;
    surveyLinkId: string;
    enableRenew: boolean;
}
