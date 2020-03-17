import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ScheduleParsingService {

  constructor (private request: RequestService) {
  }

  parse (data: string) {
    return this.request.get(`/schedule/parse?data=${encodeURIComponent(data)}`)
  }

  upload (data: string) {
    return this.request.post('/schedule/parse', data)
  }
}
