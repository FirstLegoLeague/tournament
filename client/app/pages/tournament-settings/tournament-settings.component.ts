import {Component, OnInit} from '@angular/core';
import {TournamentSettingsService} from "../../services/tournament-settings.service";
import {Notifications} from "../../services/notifications.service";
import {st} from "../../../../node_modules/@angular/core/src/render3";

@Component({
    selector: 'app-tournament-settings',
    templateUrl: './tournament-settings.component.html',
    styleUrls: ['./tournament-settings.component.css']
})
export class TournamentSettingsComponent implements OnInit {

    public settings: object;
    public loading: boolean = true;

    constructor(private tournamentSettingsService: TournamentSettingsService, private notification: Notifications) {
    }

    ngOnInit() {
        this.tournamentSettingsService.getAllSettings().subscribe({
            next: (settings: object) => {
                this.settings = {
                    tournamentTitle: {
                        display: 'tournamentTitle',
                        value: settings['tournamentTitle'],
                        name: 'tournamentTitle'
                    },
                    tournamentStage: {
                        display: 'Stage',
                        value: settings['tournamentStage'],
                        name: 'tournamentStage'
                    }
                }
                this.tournamentSettingsService.getStages().subscribe(
                    (stages: any) => {
                        this.settings['tournamentStage'].options = stages
                        this.loading = false;
                    },
                    err => {
                        this.notification.error("An error occurred while trying to load stages. \n Maybe you did not load any matches?")
                        this.loading = false;
                    }
                )
            },
            error: (err) => {
                this.notification.error("There was a problem getting the settings.")
            }
        });
    }

    save(setting: string) {
        this.tournamentSettingsService.saveSetting(setting, this.settings[setting].value).subscribe(
            response => {
                this.loading = false;
                this.notification.success("Setting saved successfully")
            },
            err => {
                this.notification.error("Oh no! Something went wrong while trying to save...")
            })
    }

}
