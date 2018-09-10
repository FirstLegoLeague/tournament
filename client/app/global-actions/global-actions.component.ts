import {Component, OnInit} from '@angular/core';
import {Input} from '@angular/core';
import {TeamsService} from "../services/teams.service";
import {MatchesService} from "../services/matches.service";
import {forkJoin} from 'rxjs';
import {TournamentDataService} from "../services/tournament-data.service";

@Component({
    selector: 'global-actions',
    templateUrl: './global-actions.component.html',
    styleUrls: ['./global-actions.component.css']
})
export class GlobalActions implements OnInit {

    @Input() public hasData: boolean = true;

    constructor(private teamService: TeamsService, private matchService: MatchesService, private tournamentDataService: TournamentDataService) {
    }

    ngOnInit() {
        this.load();
        this.tournamentDataService.dataReload.subscribe(()=>{
            this.load()
        });
    }

    load() {
        forkJoin(this.teamService.requestAll(), this.matchService.requestAll()).subscribe(
            data => {
                let teams = data[0];
                let matches = data[1];
                // @ts-ignore
                this.hasData = (teams.length > 0) || (matches.length > 0);
            },
            error => {
                this.hasData = true;
            })
    }

}
