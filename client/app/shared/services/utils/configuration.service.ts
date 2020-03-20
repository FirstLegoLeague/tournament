import { Injectable } from '@angular/core'
import { RequestService } from './request.service'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  public data: any

  constructor (private request: RequestService) {
  }

  init () {
    return new Observable(subscriber => {
      this.request.get('/config')
        .subscribe(({ data }) => {
          this.data = data
          subscriber.next(this)
          subscriber.complete()
        })
    })
  }
}
