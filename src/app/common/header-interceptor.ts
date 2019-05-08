import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

    constructor() {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        request = request.clone({
            setHeaders: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });

        return next.handle(request);
    }
}
