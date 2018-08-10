import { Component } from '@angular/core';
import { ModalModel, ModalModelService } from '../../models/interfaces/modal-model';
import { ModelModalsService } from '../../services/model-modals.service';
import { Notifications } from '../../services/notifications.service';

@Component({
  selector: 'model-delete',
  templateUrl: './model-delete.component.html',
  styleUrls: ['./model-delete.component.css']
})
export class ModelDelete {

  loading: boolean;

  constructor(private modelModalsService: ModelModalsService, private notifications: Notifications) { }

  model() {
    return this.modelModalsService.getDeleteModel();
  }

  delete() {
    this.loading = true;
    const model: ModalModel = this.model();
    const service: ModalModelService = this.modelModalsService.service(model);
    service.delete(model.id()).subscribe(() => {
      this.notifications.success(`${model.title()} deleted successfully`);
      this.loading = false;
      this.close();
      this.reload();
    }, error => {
      this.notifications.error('Deletion failed');
      this.loading = false;
      this.close();
    });
  }

  close() {
    let closeButton: HTMLElement = document.querySelector('#model-delete [data-close]');
    closeButton.click();
  }

  reload() {
    this.modelModalsService.service(this.model()).reload();
  }

}
