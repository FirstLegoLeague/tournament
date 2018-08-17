import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {Injectable} from "@angular/core";
import {catchError} from "rxjs/operators";

@Injectable()
export class RequestInterceptor implements HttpInterceptor{
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(catchError((error, caught)=>{
            if(error.status == 403){
                window.location.href = '/logout'
            } else{
                return of(error);
            }
        }) as any);
    }

}
