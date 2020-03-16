import { Injectable } from '@angular/core'
import { CollectionClient } from '@first-lego-league/synced-resources'
import { Observable } from 'rxjs'

import { Team } from '../../../../resources/team'

@Injectable({
  providedIn: 'root'
})
export class TeamsService extends CollectionClient {
	constructor () {
		super(Team, '/teams')
	}
}