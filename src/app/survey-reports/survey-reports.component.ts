import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar } from "@angular/material";
import { USERS, REPORTS_PASSWORD } from "../common/constants";

@Component({
    selector: "app-survey-reports",
    templateUrl: "./survey-reports.component.html",
    styleUrls: ["./survey-reports.component.css"]
})
export class SurveyReportsComponent {
    name: string;
    reportDetail: any = {};
    show = true;

    constructor(public dialog: MatDialog, public snackBar: MatSnackBar, ) {
    }

    displayReport(type: string) {

        let dialogRef = this.dialog.open(LoginDialogComponent, {
            width: '240px',
            data: { name: undefined, password: undefined }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (this.isValidLogin(result)) {
                this.show = false;
                this.reportDetail.type = type;
                this.reportDetail.name = result.name;
            } else {
                this.snackBar.open("User Name or Password is invalid.", "Close", { duration: 3000 });
            }

        });

    }

    private isValidLogin(data) {
        return !!data && !!data.name && !!data.password
            && data.name === USERS[data.name] && data.password == REPORTS_PASSWORD;
    }

}

/**
 * @deprecated
 * Will get deprecated
 * Please use AuthenticationDailogComponent
 */

@Component({
    selector: "login-dialog",
    templateUrl: "login-dialog.component.html",
})
export class LoginDialogComponent {

    constructor(public dialogRef: MatDialogRef<LoginDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}