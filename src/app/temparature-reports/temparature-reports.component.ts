import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { jqxGaugeComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgauge';
import { templateJitUrl } from '@angular/compiler';
import { MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { ITemparatureReport } from './temparature-reports.model';
import { ITemparature, ITemparatureCSV } from './../common/model';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';
import { WordCloudUtility } from './../common/word-cloud';
@Component({
    selector: 'temparature-reports',
    templateUrl: './temparature-reports.component.html',
    styleUrls: ['./temparature-reports.component.css']
})
export class TemparatureReportsComponent {
    displayedColumns = ['no', 'towerName', 'projectName', 'squadName', 'minTemperature', 'maxTemperature', 'avgTemperature'];
    dataSource: MatTableDataSource<Element> = new MatTableDataSource();
    surveyIdMap = {}; // <surveyId, Survey>
    squadNameMap = {}; // <squad_name, Survey>
    elementData: any[] = [];
    wordData: any;
    surveysAvailable: boolean = true;
    breakpoint: number = 0;
    options = {
        settings: {
            minFontSize: 10,
            maxFontSize: 100,
        },
        margin: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        },
        labels: true // false to hide hover labels
    };

    public lineChartData: Array<any> = [
        { data: [], label: 'Average Temperature' },
        { data: [], label: 'Minimum Temperature' },
        { data: [], label: 'Maximum Temperature' }
    ];
    public lineChartLabels: Array<any> = [];
    public lineChartOptions: any = {};
    public lineChartColors: Array<any> = [
        { // grey
            backgroundColor: 'rgba(148,159,177,0.2)',
            borderColor: 'rgba(148,159,177,1)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        },
        { // dark grey
            backgroundColor: 'rgba(77,83,96,0.2)',
            borderColor: 'rgba(77,83,96,1)',
            pointBackgroundColor: 'rgba(77,83,96,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(77,83,96,1)'
        },
        { // grey
            backgroundColor: 'rgba(148,159,177,0.2)',
            borderColor: 'rgba(148,159,177,1)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        }
    ];
    public lineChartLegend: boolean = true;
    public lineChartType: string = 'line';



    labels: any = {
        position: 'outside',
        interval: 22,
        formatValue: (value: number): string => {
            return (Math.round(value) / 22) + '';
        }
    };
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    groupId: string;
    temparatureReport: ITemparatureReport[];
    constructor(private route: ActivatedRoute, private wordCloudUtility: WordCloudUtility) {
    }

    ngOnInit() {
        this.groupId = localStorage.getItem('groupId');
        localStorage.removeItem('groupId');
        this.temparatureReport = <ITemparatureReport[]>this.route.snapshot.data.temparatureData;
        this.sortByCreatedDate();
        if (this.temparatureReport.length > 0) {
            this.populateTableData();
            this.renderWordCloudData();
            this.renderChartData();
        }
        else {
            this.surveysAvailable = false;
        }
    }
    private getTime(date?: Date) {
        return date != null ? date.getTime() : 0;
    }

    public sortByCreatedDate(): void {
        this.temparatureReport.sort((a: ITemparatureReport, b: ITemparatureReport) => {
            return this.getTime(new Date(a.createdAt)) - this.getTime(new Date(b.createdAt));
        });
        this.temparatureReport.forEach(survey => {
            let createdDate: Date = new Date(survey.createdAt);
            survey.createdAt = createdDate.getFullYear() + '-' + (createdDate.getMonth() + 1) + '-' + createdDate.getDate() + ' ' + createdDate.getHours() + ':' + createdDate.getMinutes();
        });
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
    }
    renderChartData() {
        let index: number = 0;
        this.temparatureReport.forEach(survey => {
            this.lineChartData[0].data[index] = survey.avgTemperature;
            this.lineChartData[1].data[index] = survey.minTemperature;
            this.lineChartData[2].data[index] = survey.maxTemperature;
            this.lineChartLabels[index] = survey.createdAt;
            index = index + 1;
        });
        this.lineChartData[0].label = 'Average Temperature';
        this.lineChartData[1].label = 'Minimum Temperature';
        this.lineChartData[2].label = 'Maximum Temperature';
        this.lineChartOptions = {
            responsive: true,
            tooltips: {
                enabled: true,
                mode: 'single',
                callbacks: {
                    label: (tooltipItems, data) => {
                        var multistringText: String[] = [tooltipItems.yLabel];
                        multistringText[0] = 'Tempareture - ' + multistringText[0];
                        multistringText.push('Platform - ' + this.temparatureReport[tooltipItems.index].tower.name);
                        multistringText.push('Project - ' + this.temparatureReport[tooltipItems.index].project.name);
                        return multistringText;
                    }
                }
            },
            scales: {
                xAxes: [{
                    ticks: {
                        minRotation: 90 // angle in degrees
                    }
                }]
            }
        };
    }
    private populateTableData() {
        this.dataSource.data = [];
        this.elementData = [];
        if (this.temparatureReport.length > 0) {
            this.temparatureReport.forEach((survey, index) => {
                this.elementData.push({
                    no: index + 1,
                    towerName: survey.tower.name,
                    projectName: survey.project.name,
                    squadName: survey.squad.name,
                    expiresOn: survey.expiresOn,
                    summaryId: survey.id,
                    minTemperature: survey.minTemperature,
                    maxTemperature: survey.maxTemperature,
                    avgTemperature: survey.avgTemperature
                });
            });
            this.dataSource.data = this.elementData;
            setTimeout(() => this.dataSource.paginator = this.paginator);
        }
    }
    renderWordCloudData() {
        let temperatures: ITemparature[] = [];
        this.temparatureReport.forEach(survey => {
            if (survey.temperatures.length > 0) {
                survey.temperatures.forEach(temparature => {
                    temperatures.push(temparature);
                });
            }
        });
        this.wordData = this.wordCloudUtility.renderWordCloud(temperatures);
        //this.renderWordCloud(temperatures);
    }
    public randomize(): void {
        let _lineChartData: Array<any> = new Array(this.lineChartData.length);
        for (let i = 0; i < this.lineChartData.length; i++) {
            _lineChartData[i] = { data: new Array(this.lineChartData[i].data.length), label: this.lineChartData[i].label };
            for (let j = 0; j < this.lineChartData[i].data.length; j++) {
                _lineChartData[i].data[j] = Math.floor((Math.random() * 100) + 1);
            }
        }
        this.lineChartData = _lineChartData;
    }

    // events
    public chartClicked(e: any): void {
        console.log(e);
    }

    public chartHovered(e: any): void {
        console.log(e);
    }
    downloadReport() {
        let options = {
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true,
            showTitle: true,
            useBom: true,
            noDownload: false,
            headers: ['No.', 'Platform', 'Team', 'Squad', 'Minimum Temperature', 'Maximum Temperature', 'Average Temperature']
        };
        let reprtData: ITemparatureCSV[] = [];
        let index: number = 1;
        this.temparatureReport.forEach(survey => {
            reprtData.push({
                no: index,
                platform: survey.tower.name,
                team: survey.project.name,
                squad: survey.squad.name,
                minimumTemparature: survey.minTemperature,
                maximumTemparature: survey.maxTemperature,
                averageTemparature: survey.avgTemperature
            });
            index = index + 1;
        });
        new Angular5Csv(reprtData, 'Report', options);
    }
}
