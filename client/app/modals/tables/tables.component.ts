import { Component, OnInit } from '@angular/core';
import { TablesService } from '../../services/tables.service';
import { Table } from '../../models/table';

@Component({
  selector: 'tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})
export class Tables implements OnInit {

  public loading: boolean;
  public newTable: Table;

  constructor(private tablesService: TablesService) {
    this.newTable = new Table()
  }

  ngOnInit() {
    this.tablesService.init();
  }

  tables() {
    return this.tablesService.editingTables;
  }

  addTable() {
    this.tablesService.editingTables.push(this.newTable)
    this.newTable = new Table()
  }

  removeTable(table) {
    this.tablesService.editingTables = this.tablesService.editingTables.filter(t => t !== table)
  }

  cancel() {
    this.tablesService.editingTables = this.tablesService.tables.map(table => new Table().deserialize(table));
    this.newTable.tableName = ''
    this.close()
  }

  save() {
    this.loading = true;
    this.tablesService.save().subscribe(() => {
      this.tablesService.reload();
      this.loading = false;
      this.close();
    })
  }

  close() {
    let closeButton: HTMLElement = document.querySelector('#tables [data-close]');
    closeButton.click();
  }

}
