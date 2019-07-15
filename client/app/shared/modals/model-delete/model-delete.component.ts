import { Component, ViewChild } from '@angular/core'
import { SemanticModalComponent } from 'ng-semantic'

import { Deletable, DeletableModalService } from '../../models/interfaces/modal-model'
import { Notifications } from '../../services/notifications.service'
import { DeleteService } from '../../services/delete-service.service'

declare var jQuery: any

@Component({
  selector: 'model-delete',
  templateUrl: './model-delete.component.html',
  styleUrls: ['./model-delete.component.css']
})
export class ModelDelete {

  loading: boolean
  @ViewChild('deleteModal') modal: SemanticModalComponent

  constructor (private deleteService: DeleteService, private notifications: Notifications) {
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
    jQuery('#delete-modal').modal().modal('show')
  }

  close () {
    jQuery('#delete-modal').modal().modal('hide')
  }

  reload () {
    // @ts-ignore
    this.deleteService.service(this.model()).reload().subscribe()
  }

}
