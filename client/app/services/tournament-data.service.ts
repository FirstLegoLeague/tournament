import {Injectable} from '@angular/core';
import {RequestService} from './request.service';
import {MatchesService} from './matches.service';
import {TeamsService} from './teams.service';
import {TablesService} from './tables.service';
import {Observable} from 'rxjs';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {Deletable, DeletableModalService} from "../models/interfaces/modal-model";

@Injectable({
    providedIn: 'root'
})
export class TournamentDataService implements DeletableModalService {

    constructor(private request: RequestService, private matches: MatchesService, private teams: TeamsService, private tables: TablesService) {
    }

    id(): any {
        return;
    }

    title(): string {
        return "Tournament Data";
    }

    upload(data: string): Observable<any> {
        return this.request.post('/tournamentData', {delimiter: ',', tourData: data}, {responseType: 'text'})
    }

    reload() {
        return forkJoin([this.matches.reload(), this.teams.reload(), this.tables.reload()]);
    }

    delete() {
        return this.request.delete('/tournamentData/');
    }

    deleteErrorText(): string {
        return 'Error deleting data! \n There are probably scores left in scoring..';
    };
}
