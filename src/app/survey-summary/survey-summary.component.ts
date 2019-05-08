import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { SurveySummaryService } from './survey-summary.service';
import { AgWordCloudData } from 'angular4-word-cloud';
import { jqxGaugeComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgauge';
import { ITemparature } from './../common/model';
import { templateJitUrl } from '@angular/compiler';
import { WordCloudUtility } from './../common/word-cloud';

@Component({
    selector: 'app-survey-summary',
    templateUrl: './survey-summary.component.html',
    styleUrls: ['./survey-summary.component.css']
})
export class SurveySummaryComponent {

    displayedColumns = ['rating', 'comment', 'id'];
    dataSource;
    surveyId: string;
    linkId: string;
    surveySummary;
    temperatures: ITemparature[];
    canShow;
    isExpired = false;
    respondents;

    wordData: any;
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

    labels: any = {
        position: 'outside',
        interval: 22,
        formatValue: (value: number): string => {
            return (Math.round(value) / 22) + '';
        }
    };

    ticksMinor: any = { interval: 11, size: '5%' };

    ticksMajor: any = { interval: 22, size: '10%' };

    cap: any = { size: '5%', style: { fill: '#2e79bb', stroke: '#2e79bb' } };

    border: any = { style: { fill: '#8e9495', stroke: '#7b8384', 'stroke-width': 1 } };

    pointer: any = { style: { fill: '#2e79bb' }, width: 4 };

    ranges: any[] =
        [
            { startValue: 0, endValue: 73, style: { fill: '#e53d37', stroke: '#e53d37', 'stroke-width': 20 }, startDistance: 0, endDistance: 0 },
            { startValue: 73, endValue: 146, style: { fill: '#fad00b', stroke: '#fad00b', 'stroke-width': 20 }, startDistance: 0, endDistance: 0 },
            { startValue: 147, endValue: 220, style: { fill: '#4cb848', stroke: '#4cb848', 'stroke-width': 20 }, startDistance: 0, endDistance: 0 }
        ];

    @ViewChild('myGauge') myGauge: jqxGaugeComponent;
    @ViewChild('gaugeValue') gaugeValue: ElementRef;

    constructor(private route: ActivatedRoute,
        public surveySummaryService: SurveySummaryService, private wordCloudUtility: WordCloudUtility) {
    }

    ngOnInit() {
        this.route.url.subscribe(segments => {
            this.canShow = (segments[0]['path'] === 'admin');
        });
        this.route.params.subscribe(params => {
            this.surveyId = params['id'];
            this.populateSurveySummary();
        });
    }

    ngAfterViewInit(): void {
        this.myGauge && this.myGauge.value(0);
    }

    populateSurveySummary() {
        this.surveySummaryService.retrieveSurveySummary(this.surveyId)
            .subscribe(data => {
                this.respondents = data['respondents'];
                this.isExpired = new Date(data['expiresOn']) < new Date();
                this.surveySummary = data;
                this.linkId = data['linkId'];
                if (this.canShow || this.isExpired) {
                    this.renderSummary();
                }
            });
    }

    private renderSummary() {
        if (this.surveySummary && this.surveySummary['temperatures']) {
            this.changeGaugeValue(this.surveySummary['avgTemperature']);
            this.temperatures = this.surveySummary['temperatures'];
            this.dataSource = new MatTableDataSource(this.temperatures);
            this.wordData = this.wordCloudUtility.renderWordCloud(this.temperatures);
            console.log(this.wordData);
        }
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    color(score) {
        if (score > 0 && score <= 2.5) {
            return 'red';
        } else if (score > 2.5 && score <= 5) {
            return 'orange';
        } else if (score > 5 && score <= 7.5) {
            return 'black';
        } else if (score > 7.5 && score <= 10) {
            return 'green';
        }
    }

    changeGaugeValue(value) {
        if (!!value) {
            this.myGauge && this.myGauge.value(value * 22);
            this.gaugeValue && this.gaugeValue.nativeElement && (this.gaugeValue.nativeElement.innerHTML = 'Avg ' + (Math.round(value * 10) / 10));
        }
    }

    responsePercentage(responses, respondents) {
        if (responses && respondents) {
            return Math.round((responses / respondents) * 100);
        } else {
            return '-';
        }
    }

}
