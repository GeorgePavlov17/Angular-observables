import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

export class LoginInterceptorService implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('outgoing request');
        console.log(req.url);
        console.log(req.headers);
        // const modifiedRequest = req.clone({headers: req.headers.append('Auth', 'xyz')})
        return next.handle(req).pipe(
            tap(event => {
                console.log(event);
                if(event.type === HttpEventType.Response) {
                    console.log('incoming response');
                    console.log(event.body);
                }
            })
        );
    }
}