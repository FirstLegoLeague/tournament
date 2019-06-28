import { Injectable } from '@angular/core'
import { RequestService } from './request.service'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor (private requests: RequestService) { }

  get (): Observable<any> {
    return this.requests.get('/config')
  }
}
