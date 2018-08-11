import { Component, OnInit } from '@angular/core';
import { MatchesService } from '../../services/matches.service';
import { TablesService } from '../../services/tables.service';
import { Match } from '../../models/match';
import { Table } from '../../models/table';
import { DeleteService } from '../../services/delete-service.service'
import { EditService } from '../../services/edit-service.service'

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {

  constructor(private matchesService: MatchesService, private tablesService: TablesService, private deleteModalsService: DeleteService, private editModalsService: EditService) { }

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
    this.editModalsService.setEditModel(match);
  }

  setDeleteModel(match) {
    this.deleteModalsService.setDeleteModel(match);
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
