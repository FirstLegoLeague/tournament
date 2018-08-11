import {Injectable} from '@angular/core';
import {RequestService} from './request.service';
import {MatchesService} from './matches.service';
import {TeamsService} from './teams.service';
import {TablesService} from './tables.service';
import {Observable} from 'rxjs';
import { forkJoin } from 'rxjs/observable/forkJoin';

@Injectable({
  providedIn: 'root'
})
export class TournamentDataService {

  constructor(private request: RequestService, private matches: MatchesService, private teams: TeamsService, private tables: TablesService) {
  }

  upload(data: string) : Observable<any>{
    return this.request.post('/tournamentData', { delimiter: ',', tourData: data }, { responseType: 'text' })
  }

  reload() {
    return forkJoin([this.matches.reload(), this.teams.reload(), this.tables.reload()]);
  }

}
