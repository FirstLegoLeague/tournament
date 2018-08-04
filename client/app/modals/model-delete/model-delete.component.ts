import { Component } from '@angular/core';
import { ModelModalsService } from '../../services/model-modals.service';

@Component({
  selector: 'model-delete',
  templateUrl: './model-delete.component.html',
  styleUrls: ['./model-delete.component.css']
})
export class ModelDelete {

  loading: boolean;

  constructor(private modelModalsService: ModelModalsService) { }

  model() {
    return this.modelModalsService.getDeleteModel();
  }

  delete() {
    this.loading = true;
    this.modelModalsService.service(this.model()).delete(this.model().id()).subscribe(() => {
      this.reload();
    });
  }

  reload() {
    document.location.href = document.location.href
  }

}
