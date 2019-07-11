import { Component } from '@angular/core'
import { Editable, EditableModalService } from '../../models/interfaces/modal-model'
import { Notifications } from '../../services/notifications.service'
import { EditService } from '../../services/edit-service.service'

@Component({
  selector: 'model-edit',
  templateUrl: './model-edit.component.html',
  styleUrls: ['./model-edit.component.css']
})

export class ModelEdit {

  loading: boolean

  constructor (private editModalsService: EditService, private notifications: Notifications) { }

  model () {
    return this.editModalsService.getEditModel()
  }

  save () {
    this.loading = true
    const model: Editable = this.model()
    const service: EditableModalService = this.editModalsService.service(model)
    service.save(model).subscribe(() => {
      this.notifications.success(model.savedInDB() ? 'Changes saved' : `${model.title()} saved`)
      this.reload().subscribe()
      this.close()
      this.loading = false
    }, error => {
      this.notifications.error(model.savedInDB() ? `Changes failed: ${error.message}` :
          `${model.title()} creation failed`)
      this.close()
      this.loading = false
    })
  }

  close () {
    let closeButton: HTMLElement = document.querySelector('#model-edit [data-close]')
    closeButton.click()
  }

  reload () {
    return this.editModalsService.service(this.model()).reload()
  }

  isInputType (checkedType) {
    return ['text', 'time'].some(type => type === checkedType)
  }

  trackByField (field) {
    return field
  }

}
