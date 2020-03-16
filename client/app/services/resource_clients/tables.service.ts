import { Injectable } from '@angular/core'
import { CollectionClient } from '@first-lego-league/synced-resources'
import { Observable } from 'rxjs'

import { Table } from '../../../../resources/table'

@Injectable({
  providedIn: 'root'
})
export class TablesService extends CollectionClient {
	constructor () {
		super(Table, '/tables')
	}
}