import { Component } from '@angular/core';
import { ModelModalsService } from '../../services/model-modals.service';

@Component({
  selector: 'model-edit',
  templateUrl: './model-edit.component.html',
  styleUrls: ['./model-edit.component.css']
})
export class ModelEdit {

	constructor(private modelModalsService: ModelModalsService) { }
	
	model() {
		return this.modelModalsService.getEditModel();
	}

}
