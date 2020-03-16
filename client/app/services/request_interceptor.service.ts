// TODO use ms-client

import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Injectable } from '@angular/core'
import { catchError } from 'rxjs/operators'
import { _throw } from 'rxjs-compat/observable/throw'

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  intercept (req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(req).pipe(catchError((error, caught) => {
      if (error.status === 403) {
        window.location.href = '/logout'
      }
      return _throw(error)
    }))
  }

}