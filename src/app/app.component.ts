import {Component} from '@angular/core';
import {MatDialog} from '@angular/material';
import {NavigationEnd, Router} from '@angular/router';
import 'rxjs/add/operator/filter';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'Team Temperature';

    constructor(public router: Router, public dialog: MatDialog) {
        router.events
            .filter(event => (event instanceof NavigationEnd))
            .subscribe((event) => {
                this.dialog.closeAll();
            });

    }
}
