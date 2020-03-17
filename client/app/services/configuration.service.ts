import { Injectable } from '@angular/core'
import { RequestService } from './request.service'

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  public data: any

  constructor (private request: RequestService) {
  }

  init () {
    return this.request.get('/config').toPromise()
      .then(config => { this.data = config })
  }
}
