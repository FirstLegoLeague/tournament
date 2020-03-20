import { Component } from '@angular/core'
import { Notifications } from '../../shared/services/ui/notifications.service'
import { DeleteService } from '../../shared/services/delete.service'
import { ModalsService } from '../../shared/services/ui/modals.service'

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

  show () {
    return this.deleteService.service
  }

  title () {
    return this.deleteService.service.title(this.deleteService.model)
  }

  delete () {
    this.loading = true
    this.deleteService.service.delete(this.deleteService.model).subscribe(
      () => this.notifications.success(`${this.title()} deleted successfully`),
      error => this.notifications.error(`Deletion of ${this.title()} failed ${error.error}`),
      () => this.close())
  }

  close () {
    this.modal.close()
    this.loading = false
  }
}
