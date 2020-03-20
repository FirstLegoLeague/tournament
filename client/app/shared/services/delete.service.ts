import { Injectable } from '@angular/core'

import { ModalsService } from './ui/modals.service'

@Injectable({
  providedIn: 'root'
})
export class DeleteService {
  public model: any
  public service: any
  modal: any

  constructor (private modalsService: ModalsService) {
    this.modal = modalsService.modal('delete-modal')
  }

  openModalFor (model, service) {
    this.model = model
    this.service = service
    this.modal.open()
  }

  close () {
    this.modal.close()
  }
}
