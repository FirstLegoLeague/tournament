import { Component, OnInit } from '@angular/core';
import { ModelModalsService } from '../../services/model-modals.service';
import { MatchesService } from '../../services/matches.service';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {

  tables = [];

  constructor(private matchesService: MatchesService, private requests: RequestService, private modelModalsService: ModelModalsService) { }

  ngOnInit() {
    this.matchesService.reload();

    this.requests.get('/table/all').subscribe((data: any) =>{
      this.tables = data;
    });
  }

  matches() {
    return this.matchesService.getAllMatches();
  }

  setEditModel(match) {
    this.modelModalsService.setEditModel(match);
  }

  setDeleteModel(match) {
    this.modelModalsService.setDeleteModel(match);
  }

}
