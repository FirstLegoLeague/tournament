import { Component, ViewChild } from '@angular/core'

import { Deletable, DeletableModalService } from '../../models/interfaces/modal-model'
import { Notifications } from '../../services/notifications.service'
import { DeleteService } from '../../services/delete-service.service'
import { ModalsService } from '../../services/modals.service'

@Component({
  selector: 'model-delete',
  templateUrl: './model-delete.component.html',
  styleUrls: ['./model-delete.component.css']
})
export class ModelDelete {

  loading: boolean
  modal: any

  constructor (private deleteService: DeleteService, private notifications: Notifications, private modalsService: ModalsService) {
    this.modal = modalsService.modal('delete-modal')
  }

  model () {
    return this.deleteService.getDeleteModel()
  }

  delete () {
    this.loading = true
    const model: Deletable = this.model()
    const service: DeletableModalService = this.deleteService.service(model)
    service.delete(model.id()).subscribe(() => {
      this.notifications.success(`${model.title()} deleted successfully`)
      this.loading = false
      this.close()
      this.reload()
    }, error => {
      if (!service.deleteErrorText()) {
        this.notifications.error(`Deletion failed ${error.error}`)
      } else {
        this.notifications.error(service.deleteErrorText())
      }
      this.loading = false
      this.close()
    })
  }

  open () {
    this.modal.open()
  }

  close () {
    this.modal.close()
  }

  reload () {
    // @ts-ignore
    this.deleteService.service(this.model()).reload().subscribe()
  }

}
