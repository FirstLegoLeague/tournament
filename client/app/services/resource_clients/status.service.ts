import { Injectable } from '@angular/core'
import { EntityClient } from '@first-lego-league/synced-resources'
import { Observable } from 'rxjs'

import { Status } from '../../../../resources/status'

@Injectable({
  providedIn: 'root'
})
export class SettingsService extends EntityClient {
	constructor () {
		super(Status, '/status')
	}
}