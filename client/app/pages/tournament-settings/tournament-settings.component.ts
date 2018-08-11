import {Component, OnInit} from '@angular/core';
import {TournamentSettingsService} from "../../services/tournament-settings.service";
import {Notifications} from "../../services/notifications.service";
import { TournamentStatusService } from '../../services/tournament-status.service';
import { Observable } from '../../../../node_modules/rxjs';

@Component({
    selector: 'app-tournament-settings',
    templateUrl: './tournament-settings.component.html',
    styleUrls: ['./tournament-settings.component.css']
})
export class TournamentSettingsComponent implements OnInit {

    public settings: object;
    public loading: boolean = true;
    public currentMatch: number;

    constructor(private tournamentSettingsService: TournamentSettingsService, private notification: Notifications, private tournamentStatusService: TournamentStatusService) {
    }

    ngOnInit() {
        this.tournamentSettingsService.getAllSettings().subscribe({
            next: (settings: object) => {
                this.settings = settings;
                this.loading = false;
            },
            error: (err) => {
                this.notification.error("There was a problem getting the settings.")
            }
        });
        
        this.tournamentStatusService.getMatch().subscribe({
            next: (newMatch: number) =>{
                this.currentMatch = newMatch
            },
            error: (err) =>{
                this.notification.error("There was a problem getting the current match number.")
            }
        })
    }

}
