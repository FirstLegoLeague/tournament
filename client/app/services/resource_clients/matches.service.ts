import { Injectable } from '@angular/core'
import { CollectionClient } from '@first-lego-league/synced-resources'
import { Observable } from 'rxjs'

import { Match } from '../../../../resources/match'

@Injectable({
  providedIn: 'root'
})
export class MatchesService extends CollectionClient {
	constructor () {
		super(Match, '/matches')
	}
}