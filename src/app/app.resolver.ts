import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { URL_PREFIX } from './common/constants';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
@Injectable()
export class TemparatureDataResolver implements Resolve<Observable<string>> {
    constructor(private http: HttpClient, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        let id: string = route.params['id'];
        let groupName: string = this.getGroupName(id);
        localStorage.setItem('groupId', groupName);
        !!id ? groupName : this.router.navigate([`not_found`]);
        let data: any = {
            name: groupName
        };
        return this.http.post(URL_PREFIX + '/reports', data);
    }
    getGroupName(id: string): string {
        switch (id) {
            case '3817f4e4-478c-11e8-842f-0ed5f89f718b':
                return 'C2E';
            case '3817f7fa-478c-11e8-842f-0ed5f89f718b':
                return 'IBGT';
            case '3817f962-478c-11e8-842f-0ed5f89f718b':
                return 'ITT';
            case '3817faa2-478c-11e8-842f-0ed5f89f718b':
                return 'MOT';
            case '3817fbd8-478c-11e8-842f-0ed5f89f718b':
                return 'Future Ready';
            case 'b4b53a12-5500-11e8-9c2d-fa7ae01bbebc':
                return 'Tech Services';
            case 'b4b53d0a-5500-11e8-9c2d-fa7ae01bbebc':
                return 'Delivery Enablements/ITSS';
            default:
                this.router.navigate([`not_found`])
        }
        return '';
    }
}