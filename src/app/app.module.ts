import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { ChartsModule } from 'ng2-charts';
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
    MAT_DIALOG_DEFAULT_OPTIONS,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule, MatChipsModule,
    MatDatepickerModule, MatDialogModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule, MatListModule,
    MatMenuModule,
    MatNativeDateModule, MatPaginatorModule, MatProgressSpinnerModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule, MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatToolbarModule, MatTooltipModule
} from '@angular/material';

import { CreateSurveyComponent } from "./create-survey/create-survey.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SurveySummaryComponent } from "./survey-summary/survey-summary.component";
import { FillSurveyComponent } from "./fill-survey/fill-survey.component";
import { RouterModule, Routes } from "@angular/router";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { CreateSurveyService } from "./create-survey/create-survey.service";
import { FillSurveyService } from "./fill-survey/fill-survey.service";
import { SurveySummaryService } from "./survey-summary/survey-summary.service";
import { AgWordCloudModule } from "angular4-word-cloud";
import { NotFoundComponent } from "./not-found/not-found.component";
import { LoginDialogComponent, SurveyReportsComponent } from "./survey-reports/survey-reports.component";
import { HeaderInterceptor } from "./common/header-interceptor";
import { UserDashboardComponent } from "./user-dashboard/user-dashboard.component";
import { SurveysComponent } from "./surveys/surveys.component";
import { SurveysService } from "./surveys/surveys.service";
import { jqxGaugeComponent } from "jqwidgets-scripts/jqwidgets-ts/angular_jqxgauge";
import { SurveyReportComponent } from "./survey-report/survey-report.component";
import { FillSurveyGuard } from "./common/fill-survey-guard";
import { ViewSurveysComponent } from './view-surveys/view-surveys.component';
import { ViewSurveysService } from './view-surveys/view-surveys.service';
import { UpdateSurveyComponent } from './update-survey/update-survey.component';
import { UpdateSurveyService } from './update-survey/update-survey.service';
import { AuthenticationDialogComponent } from './authentication/authentication-dialog.component';
import { TemparatureReportsComponent } from "./temparature-reports/temparature-reports.component";
import { WordCloudUtility } from './common/word-cloud';
import { TemparatureDataResolver } from './app.resolver'
const appRoutes: Routes = [
    { path: "admin", component: UserDashboardComponent },
    { path: "admin/create", component: CreateSurveyComponent },
    { path: "admin/surveys", component: SurveysComponent },
    { path: "admin/reports", component: SurveyReportsComponent },
    { path: "admin/summary/:id", component: SurveySummaryComponent },
    { path: "admin/survey/:id", component: UpdateSurveyComponent },
    { path: "fill/survey/:id", component: FillSurveyComponent, canActivate: [FillSurveyGuard] },
    { path: "surveys/:squadName/:projectName", component: ViewSurveysComponent },
    { path: "summary/:id", component: SurveySummaryComponent },
    {
        path: "admin/temparature/reports/:id", component: TemparatureReportsComponent,
        resolve: { temparatureData: TemparatureDataResolver }
    },
    { path: "not_found", component: NotFoundComponent },
    { path: "**", redirectTo: "not_found" }

];

@NgModule({
    declarations: [
        AppComponent,
        NotFoundComponent,
        CreateSurveyComponent,
        FillSurveyComponent,
        SurveySummaryComponent,
        SurveyReportsComponent,
        SurveyReportComponent,
        UserDashboardComponent,
        SurveysComponent,
        jqxGaugeComponent,
        LoginDialogComponent,
        ViewSurveysComponent,
        UpdateSurveyComponent,
        AuthenticationDialogComponent,
        TemparatureReportsComponent
    ],
    imports: [
        RouterModule.forRoot(
            appRoutes,
        ),
        AgWordCloudModule.forRoot(),
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCheckboxModule,
        MatCardModule,
        MatFormFieldModule,
        MatSlideToggleModule,
        MatAutocompleteModule,
        MatInputModule,
        MatStepperModule,
        MatSnackBarModule,
        MatTableModule,
        MatSliderModule,
        MatMenuModule,
        MatGridListModule,
        MatIconModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatToolbarModule,
        MatSelectModule,
        MatDialogModule,
        MatPaginatorModule,
        MatSortModule,
        MatProgressSpinnerModule,
        MatListModule,
        MatTooltipModule,
        MatChipsModule,
        ChartsModule
    ],
    entryComponents: [
        LoginDialogComponent,
        AuthenticationDialogComponent
    ],
    providers: [
        CreateSurveyService,
        FillSurveyService,
        SurveySummaryService,
        SurveysService,
        ViewSurveysService,
        WordCloudUtility,
        UpdateSurveyService,
        TemparatureDataResolver,
        FillSurveyGuard,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HeaderInterceptor,
            multi: true
        },
        { provide: "LOCALSTORAGE", useFactory: getLocalStorage },
        { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

export function getLocalStorage() {
    return (typeof window !== "undefined") ? window.localStorage : null;
}
