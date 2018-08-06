import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestService } from './request.service';
import { Table } from '../models/table';

@Injectable({
  providedIn: 'root'
})

export class TablesService {

  public tables: Table[] = [];

  constructor(private requests: RequestService) { }

  delete(tableId: number) : Observable<any>{
    return this.requests.delete(`/table/${tableId}`, { responseType: 'text' });
  }

  save(table: Table) : Observable<any>{
    const method = table.id() ? 'put' : 'post';
    const url = table.id() ? `/table/${table.id()}` : '/table/';
    return this.requests[method](url, table.body());
  }

  reload() {
    return this.requests.get('/table/all').subscribe((tables: Table[]) => {
    	this.tables = tables.map(table => new Table().deserialize(table));
    });
  }

}
