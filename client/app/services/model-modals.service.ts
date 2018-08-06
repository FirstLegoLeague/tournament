import { Injectable } from '@angular/core';
import { ModalModel } from '../models/interfaces/modal-model'
import { TeamsService } from './teams.service'
import { MatchesService } from './matches.service'

@Injectable({
  providedIn: 'root'
})
export class ModelModalsService {

	private editModel: ModalModel;
	private deleteModel: ModalModel;

	constructor(private teamsService: TeamsService, private matchesServices: MatchesService) { }

	setDeleteModel(model) {
		this.deleteModel = model;
	}

	setEditModel(model) {
		this.editModel = model;
	}

	getDeleteModel() {
		return this.deleteModel;
	}

	getEditModel() {
		return this.editModel;
	}

	service(model) {
		switch(model.constructor.name) {
			case 'Team': return this.teamsService;
			case 'Match': return this.matchesServices;
			default: return null;
		}
	}

}
