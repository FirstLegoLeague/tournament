// TODO use ms-client

import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor (private http: HttpClient) {
  }

  get (endpoint: string) {
    return this.http.get(endpoint)
  }

  post (endpoint: string, data: any, headers = {}) {
    return this.http.post(endpoint, data, headers)
  }

  put (endpoint: string, data: any, headers = {}) {
    return this.http.put(endpoint, data, headers)
  }

  delete (endpoint: string, headers = {}) {
    return this.http.delete(endpoint, headers)
  }

}