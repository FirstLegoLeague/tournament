import { Injectable } from '@angular/core'
import { from } from 'rxjs'
import { createClient } from '@first-lego-league/ms-client'


@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private client: any

  constructor () {
    this.client = createClient()
  }

  get (endpoint: string, headers = {}) {
    return from(this.client.get(endpoint, headers))
  }

  post (endpoint: string, data: any, headers = {}) {
    return from(this.client.post(endpoint, data, headers))
  }

  put (endpoint: string, data: any, headers = {}) {
    return from(this.client.put(endpoint, data, headers))
  }

  delete (endpoint: string, headers = {}) {
    return from(this.client.delete(endpoint, headers))
  }

}
