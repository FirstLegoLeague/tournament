import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { RequestService } from './request.service'
import { Image } from '../models/image'
import { DeletableModalService } from '../models/interfaces/modal-model'
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ImagesService implements DeletableModalService {
  public images: Image[] = []

  constructor (private requests: RequestService) {
  }

  init () {
    return this.reload()
  }

  reload () {
    return this.requests.get('/image/local').pipe(map((images: Image[]) => {
      this.images = images.map(image => new Image().deserialize(image))
      return this.images
    }))
  }

  delete (name: string) {
    return this.requests.delete(`/image/${name}`, { responseType: 'text' })
  }

  upload (formData: FormData): Observable<any> {
    return this.requests.post('/image/upload', formData)
  }

  deleteErrorText (): string {
    return ''
  }

}
