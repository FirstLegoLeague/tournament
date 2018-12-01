import {Component, OnInit} from '@angular/core';
import {TournamentSettingsService} from "../../shared/services/tournament-settings.service";
import {Notifications} from "../../shared/services/notifications.service";
import {st} from "../../../../node_modules/@angular/core/src/render3";
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
                private deleteModalsService: DeleteService) {
    }

    ngOnInit() {
        this.reload();
        this.tournamentDataService.dataReload.subscribe(()=>{
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
                    },
                    practiceAmountOfMatches: {
                        display: 'Amount of practice rounds',
                        value: settings['practiceAmountOfMatches'],
                        name: 'practiceAmountOfMatches'
                    },
                    rankingAmountOfMatches: {
                        display: 'Amount of ranking rounds',
                        value: settings['rankingAmountOfMatches'],
                        name: 'rankingAmountOfMatches'
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
                this.notification.success(`${this.settings[setting].display} saved successfully`)
            },
            err => {
                this.notification.error("Oh no! Something went wrong while trying to save...")
            })
    }

    setDeleteModel(model){
        this.deleteModalsService.setDeleteModel(model);
    }

    haveDataInDb(){
        this.tournamentDataService.hasData().subscribe(result=>{
            this.hasDataInDb = result
        })
    }
}


