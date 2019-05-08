import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, Inject } from '@angular/core';

@Component({
    selector: "authentication-dialog",
    templateUrl: "authentication-dialog.component.html",
})
export class AuthenticationDialogComponent {

    showClose = true;

    constructor(public dialogRef: MatDialogRef<AuthenticationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    ngOnInit() {
        if (!!this.data.showClose) {
            this.showClose = this.data.showClose === 'true';
        }
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    isValidData() {
        return
    }

}