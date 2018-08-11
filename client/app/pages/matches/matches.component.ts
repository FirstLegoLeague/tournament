import { Component, OnInit } from '@angular/core';
import { ModelModalsService } from '../../services/model-modals.service';
import { MatchesService } from '../../services/matches.service';
import { TablesService } from '../../services/tables.service';
import { Match } from '../../models/match';
import { Table } from '../../models/table';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {

  constructor(private matchesService: MatchesService, private tablesService: TablesService, private modelModalsService: ModelModalsService) { }

  ngOnInit() {
    this.matchesService.init();
    this.tablesService.init();
  }

  tables() {
    return this.tablesService.tables;
  }

  matches() {
    return this.matchesService.matches;
  }

  setEditModel(match) {
    this.modelModalsService.setEditModel(match);
  }

  setDeleteModel(match) {
    this.modelModalsService.setDeleteModel(match);
  }

  newTable() {
    return new Table()
  }

  newMatch() {
    const match = new Match()
    match.matchTeams = this.tables().map(table => ({ tableId: table.tableId, teamNumber: null }));
    return match;
  }

}
