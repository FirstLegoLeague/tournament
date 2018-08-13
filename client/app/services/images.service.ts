import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { RequestService } from './request.service'
import { Image } from '../models/image'
import { DeletableModalService } from '../models/interfaces/modal-model'

@Injectable({
  providedIn: 'root'
})
export class ImagesService implements DeletableModalService {
  private initStarted: boolean = false
  public images: Image[] = []

  constructor (private requests: RequestService) {
  }

  init () {
    if (!this.initStarted) {
      this.initStarted = true
      this.reload()
    }
  }

  reload () {
    return this.requests.get('/image/all').subscribe((images: Image[]) => {
      this.images = images.map(image => new Image().deserialize(image))
    },(error)=>{
      console.error(`Error getting all images: ${error}!`)
    },()=>{
      console.debug(`Received all images successfully`)
    })
  }

  delete (name: string) {
    return this.requests.delete(`/image/${name}`, { responseType: 'text' })
  }

  upload (formData: FormData) : Observable<any>{
    return this.requests.post('/image/upload', formData)
  }
}
