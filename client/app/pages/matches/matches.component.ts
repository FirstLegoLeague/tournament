import { Component, OnInit } from '@angular/core';
import { ModelModalsService } from '../../services/model-modals.service';
import { MatchesService } from '../../services/matches.service';
import { RequestService } from '../../services/request.service';
import { Match } from '../../models/match';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {

  matches = [];
  tables = [];

  constructor(private matchesService: MatchesService, private requests: RequestService, private modelModalsService: ModelModalsService) { }

  ngOnInit() {
    this.matchesService.getAllMatches().subscribe((data: any) =>{
      this.matches = data.map(match => new Match().deserialize(match));
    });

    this.requests.get('/table/all').subscribe((data: any) =>{
      this.tables = data;
    });
  }

  setEditModel(match) {
    this.modelModalsService.setEditModel(match);
  }

  setDeleteModel(match) {
    this.modelModalsService.setDeleteModel(match);
  }

}
