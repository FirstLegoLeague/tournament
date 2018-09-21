import { Component, OnInit, Renderer } from '@angular/core';
import { TablesService } from '../../services/tables.service';
import { Notifications } from '../../services/notifications.service';
import { Table } from '../../models/table';

@Component({
  selector: 'tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})
export class Tables implements OnInit {

  public loading: boolean;
  public newTable: Table;

  constructor(private tablesService: TablesService, private notifications: Notifications, private renderer: Renderer) {
    this.newTable = new Table()
  }

  ngOnInit() {
    this.tablesService.init();
  }

  tables() {
    return this.tablesService.editingTables;
  }

  tableChanged(table) {
    if (table === this.newTable && table.tableName.length > 0) {
       this.tablesService.editingTables.push(this.newTable);
       this.newTable = new Table()
       setTimeout(() => this.renderer.selectRootElement(`#table-${this.tables().indexOf(table)} input`).focus())
    } else if (table !== this.newTable && table.tableName.length === 0) {
      this.removeTable(table)
    }
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
      this.notifications.success('Changes saved');
      this.tablesService.reload().subscribe();
      this.close();
      this.loading = false;
    }, error => {
      this.notifications.error('Change failed');
      this.close();
      this.loading = false;
    })
  }

  close() {
    let closeButton: HTMLElement = document.querySelector('#tables [data-close]');
    closeButton.click();
  }

}
