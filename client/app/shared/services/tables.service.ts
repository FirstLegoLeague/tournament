import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {RequestService} from './request.service';
import {Table} from '../models/table';
import {map} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})

export class TablesService {

    private initStarted: boolean = false;
    public tables: Table[] = [];
    public editingTables: Table[] = [];

    constructor(private requests: RequestService) {
    }

    init() {
        return this.reload();
    }

    reload() {
        return this.requests.get('/table/all').pipe(map((tables: Table[]) => {
            this.tables = tables.map(table => new Table().deserialize(table));
            this.editingTables = tables.map(table => new Table().deserialize(table));
            return this.tables;
        }))
    }

    save(): Observable<any> {
        const tablesToDelete = this.tables.filter(table => this.editingTables.every(editingTable => editingTable.tableId !== table.tableId));
        const tablesToCreate = this.editingTables.filter(table => isNaN(table.tableId));
        const tablesToUpdate = this.editingTables.filter(editingTable =>
            isFinite(editingTable.tableId) && editingTable.tableName !== this.tables.find(table => table.tableId === editingTable.tableId).tableName)

        // Add numbers to new tables
        let lastTableId = Math.max.apply(null, this.tables.map(table => table.tableId)) || 0;
        tablesToCreate.forEach((table, index) => {
            table.tableId = (lastTableId + 1 + index)
        })

        const tablesToDeleteObservables = tablesToDelete.map(table => this.requests.delete(`/table/${table.id()}`, {responseType: 'text'}))
        const tablesToCreateObservables = tablesToCreate.map(table => this.requests.post('/table/', table.body(), {responseType: 'text'}))
        const tablesToUpdateObservables = tablesToUpdate.map(table => this.requests.put(`/table/${table.id()}`, table.body()))

        return forkJoin(tablesToDeleteObservables.concat(tablesToCreateObservables).concat(tablesToUpdateObservables))
    }


}
