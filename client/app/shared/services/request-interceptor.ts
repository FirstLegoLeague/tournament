import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {Injectable} from "@angular/core";
import {catchError} from "rxjs/operators";
import {_throw} from "../../../../node_modules/rxjs-compat/observable/throw";

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
        return next.handle(req).pipe(catchError((error, caught) => {
            if (error.status == 403) {
                window.location.href = '/logout'
            }
            return _throw(error);
        }));
    }

}
