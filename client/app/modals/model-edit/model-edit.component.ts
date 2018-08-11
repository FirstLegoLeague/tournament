import { Component } from '@angular/core';
import { ModalModel, ModalModelService } from '../../models/interfaces/modal-model';
import { ModelModalsService } from '../../services/model-modals.service';
import { Notifications } from '../../services/notifications.service';

@Component({
  selector: 'model-edit',
  templateUrl: './model-edit.component.html',
  styleUrls: ['./model-edit.component.css']
})

export class ModelEdit {

  loading: boolean;

  constructor(private modelModalsService: ModelModalsService, private notifications: Notifications) { }
  
  model() {
    return this.modelModalsService.getEditModel();
  }

  save() {
    this.loading = true;
    const model: ModalModel = this.model();
    const service: ModalModelService = this.modelModalsService.service(model);
    service.save(model).subscribe(() => {
      this.notifications.success(model.savedInDB() ? 'Changes saved' : `${model.title()} saved`);
      this.reload();
      this.close();
      this.loading = false;
    }, error => {
      this.notifications.error(model.savedInDB() ? 'Changes failed' : `${model.title()} creation failed`);
      this.close();
      this.loading = false;
    });
  }

  close() {
    let closeButton: HTMLElement = document.querySelector('#model-edit [data-close]');
    closeButton.click();
  }

  reload() {
    this.modelModalsService.service(this.model()).reload();
  }

}
