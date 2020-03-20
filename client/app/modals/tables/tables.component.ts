import { Component, OnInit, Renderer2 } from '@angular/core'
import { Observable, forkJoin } from 'rxjs'
import { TablesService } from '../../shared/services/resource_clients/tables.service'
import { Notifications } from '../../shared/services/ui/notifications.service'
import { ModalsService } from '../../shared/services/ui/modals.service'

import { Table } from '../../../../resources/table'

@Component({
  selector: 'tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})
export class Tables implements OnInit {

  public loading: boolean
  public newTable: Table
  private editingTables = []
  modal: any

  constructor (private tablesService: TablesService, private notifications: Notifications, private renderer: Renderer2, private modalsService: ModalsService) {
    this.modal = modalsService.modal('tables-modal')
    this.newTable = new Table()
  }

  ngOnInit () {
    this.tablesService.init().subscribe(() => {
      this.editingTables = this.tablesService.data().map(table => new Table(table.toJson()))
    })
  }

  tables () {
    return this.editingTables
  }

  tableChanged (table) {
    if (table === this.newTable && table.name.length > 0) {
      this.editingTables.push(this.newTable)
      this.newTable = new Table()
      setTimeout(() => this.renderer.selectRootElement(`#table-${this.tables().indexOf(table)} input`).focus())
    } else if (table !== this.newTable && table.name.length === 0) {
      this.removeTable(table)
    }
  }

  removeTable (table) {
    this.editingTables = this.editingTables.filter(t => t !== table)
  }

  cancel () {
    this.editingTables = this.tablesService.data().map(table => new Table().deserialize(table))
    this.newTable.name = ''
    this.close()
  }

  save () {
    this.loading = true
    this.updateTablesFromEditingTables().subscribe(
      () => {
        this.notifications.success('Tables saved')
        this.close()
      },
      error => {
        this.notifications.error(`Change failed: ${error.message}`)
        this.close()
      })
  }

  updateTablesFromEditingTables (): Observable<any> {
    const tablesToDelete = this.tablesService.data().filter(table => this.editingTables.every(editingTable => editingTable._id !== table._id))
    const tablesToCreate = this.editingTables.filter(table => !table._id)
    const tablesToUpdate = this.editingTables.filter(editingTable =>
      editingTable._id &&
      editingTable.name !== this.tablesService.data().find(table => table._id === editingTable._id).name
    )

    return forkJoin([].concat(tablesToDelete.map(table => this.tablesService.delete(table)))
                      .concat(tablesToCreate.map(table => this.tablesService.create(table)))
                      .concat(tablesToUpdate.map(table => this.tablesService.update(table))))
  }

  open () {
    this.modal.open()
  }

  close () {
    this.modal.close()
    this.loading = false
  }
}
