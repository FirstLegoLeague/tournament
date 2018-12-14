import {Component, OnInit} from '@angular/core';
import {TournamentSettingsService} from "../../shared/services/tournament-settings.service";
import {Notifications} from "../../shared/services/notifications.service";
import {TournamentStatusService} from '../../shared/services/tournament-status.service';
import {DeleteService} from "../../shared/services/delete-service.service";
import {TournamentDataService} from "../../shared/services/tournament-data.service";

@Component({
    selector: 'app-tournament-settings',
    templateUrl: './tournament-settings.component.html',
    styleUrls: ['./tournament-settings.component.css']
})
export class TournamentSettingsComponent implements OnInit {

    public settings: object;
    public loading: boolean = true;
    public hasDataInDb = false;

    constructor(private tournamentSettingsService: TournamentSettingsService,
                public tournamentDataService: TournamentDataService,
                private notification: Notifications,
                private deleteModalsService: DeleteService,
                private tournamentStatusService: TournamentStatusService) {
    }

    ngOnInit() {
        this.reload();
        this.tournamentDataService.dataReload.subscribe(() => {
            this.reload()
        })
    }

    private reload() {
        this.tournamentSettingsService.getAllSettings().subscribe({
            next: (settings: object) => {
                this.haveDataInDb()
                this.settings = {
                    tournamentTitle: {
                        display: 'Tournament Title',
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
                    }
                )

                this.tournamentStatusService.getCurrentMatch().subscribe((match) => {
                    this.settings['currentMatch'] = {
                        display: "Current Match",
                        value: match.matchId,
                        name: 'currentMatch'
                    }
                }, error => {
                    this.settings['currentMatch'] = {
                        display: "Current Match",
                        value: 0,
                        name: 'currentMatch'
                    }
                })
            },
            error: (err) => {
                this.notification.error("There was a problem getting the settings.")
            }
        });
    }

    save(setting: string) {
        if (setting === 'currentMatch') {
            this.tournamentStatusService.setMatch(this.settings['currentMatch'].value).subscribe(() => {
                this.notification.success("Match saved successfully")
            }, (err) => {
                debugger;
                this.notification.error("Oh no! Something went wrong while trying to save match.")
            })
        } else {
            this.tournamentSettingsService.saveSetting(setting, this.settings[setting].value).subscribe(
                response => {
                    this.notification.success("Setting saved successfully")
                },
                err => {
                    this.notification.error("Oh no! Something went wrong while trying to save...")
                })
        }
    }

    setDeleteModel(model) {
        this.deleteModalsService.setDeleteModel(model);
    }

    haveDataInDb() {
        this.tournamentDataService.hasData().subscribe(result => {
            this.hasDataInDb = result
        })
    }
}


