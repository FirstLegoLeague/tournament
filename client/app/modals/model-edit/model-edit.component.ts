import { Component } from '@angular/core'
import { Notifications } from '../../shared/services/ui/notifications.service'
import { EditService } from '../../shared/services/edit.service'
import { ModalsService } from '../../shared/services/ui/modals.service'

@Component({
  selector: 'model-edit',
  templateUrl: './model-edit.component.html',
  styleUrls: ['./model-edit.component.css']
})
export class ModelEdit {

  loading: boolean
  modal: any

  constructor (private editService: EditService,
               private notifications: Notifications,
               private modalsService: ModalsService) {
    this.modal = modalsService.modal('edit-modal')
  }

  title () {
    if (this.editService.model.id()) {
      return this.editService.service.title(this.editService.model)
    } else {
      return `New ${this.editService.model.constructor.name}`
    }
  }

  show () {
    return this.editService.service
  }

  model () {
    return this.editService.model
  }

  fields () {
    return this.editService.service.fields()
  }

  save () {
    this.loading = true
    this.editService.service.save(this.editService.model).subscribe(
      () => this.notifications.success(this.editService.model._id ? 'Changes saved' : `${this.title()} saved`),
      error => this.notifications.error(this.editService.model._id ? `Changes failed: ${error.message}` : `${this.title()} creation failed`),
      () => this.close())
  }

  close () {
    this.modal.close()
    this.loading = false
  }

  isInputType (checkedType) {
    return ['text', 'time'].some(type => type === checkedType)
  }

  trackByDisplay (index, field) {
    return field.display
  }

}
