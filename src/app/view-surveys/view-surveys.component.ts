import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { ViewSurveysService } from './view-surveys.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-view-surveys',
    templateUrl: './view-surveys.component.html',
    styleUrls: ['./view-surveys.component.css']
})
export class ViewSurveysComponent {
    displayedColumns = ['no', 'name', 'createdAt', 'expiresOn', 'surveyId'];
    dataSource: MatTableDataSource<Element> = new MatTableDataSource();
    surveyIdMap = {}; // <surveyId, Survey>
    squadNameMap = {}; // <squad_name, Survey>
    elementData: Element[] = [];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private route: ActivatedRoute,
        private viewSurveysService: ViewSurveysService) {
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            const squadName = params['squadName'];
            const projectName = params['projectName'];
            this.populateTableData(squadName, projectName);
        });

    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
    }

    getCreatedAt(surveyId) {
        return this.surveyIdMap[surveyId].createdAt;
    }

    getSurveys(squadName) {
        return this.squadNameMap[squadName];
    }

    private populateTableData(squadName: string, projectName: string) {
        this.viewSurveysService.retrieveSurveysBySquadName(squadName, projectName).subscribe(data => {
            this.dataSource.data = [];
            this.elementData = [];
            data.forEach((survey, index) => {
                this.elementData.push({
                    no: index + 1,
                    name: survey.squad.name,
                    createdAt: survey.createdAt,
                    expiresOn: survey.expiresOn,
                    surveyId: survey.id,
                    surveyLinkId: survey.linkId,
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
    surveyLinkId: string;
}
