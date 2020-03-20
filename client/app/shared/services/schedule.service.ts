import { Injectable, EventEmitter } from '@angular/core'
import { DeletableModalService } from '../interfaces/modal-model'
import { RequestService } from './utils/request.service'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ScheduleService extends EventEmitter<any> implements DeletableModalService {
  constructor (private request: RequestService) {
    super()
  }

  parse (data: string) {
    return this.request.get(`/schedule?data=${encodeURIComponent(data)}`)
  }

  upload (data: string) {
    return new Observable(subscriber => {
      return this.request.post('/schedule', { data }).subscribe(response => {
        this.emit()
        subscriber.next(response)
        subscriber.complete()
      })
    })
  }

  delete (entry) {
    return new Observable(subscriber => {
      return this.request.delete('/schedule').subscribe(response => {
        this.emit()
        subscriber.next(response)
        subscriber.complete()
      })
    })
  }

  title (entry) {
    return 'Tournament data'
  }
}
