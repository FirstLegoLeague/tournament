import {Component, OnInit} from '@angular/core';
import {TournamentSettingsService} from "../../shared/services/tournament-settings.service";
import {Notifications} from "../../shared/services/notifications.service";
import {TournamentStatusService} from '../../shared/services/tournament-status.service';
import {DeleteService} from "../../shared/services/delete-service.service";
import {TournamentDataService} from "../../shared/services/tournament-data.service";
import {forkJoin} from "rxjs";
import * as moment from 'moment';

@Component({
    selector: 'app-tournament-settings',
    templateUrl: './tournament-settings.component.html',
    styleUrls: ['./tournament-settings.component.css']
})
export class TournamentSettingsComponent implements OnInit {

    public settings: object;
    public loading: boolean = true;
    public hasDataInDb = false;

    public MIN_AMOUNT_OF_ROUNDS = 0;
    public MAX_AMOUNT_OF_ROUNDS = 5

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
        this.tournamentStatusService.onCurrentMatchChangeEvent.subscribe((match) => {
            if (this.settings['currentMatch']) {
                this.settings['currentMatch'].value = match.matchId
            }
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
                        display: 'Current Stage',
                        value: settings['tournamentStage'],
                        name: 'tournamentStage'
                    },
                    numberOfPracticeRounds: {
                        display: 'Practice rounds',
                        value: settings['numberOfPracticeRounds'],
                        name: 'numberOfPracticeRounds'
                    },
                    numberOfRankingRounds: {
                        display: 'Ranking rounds',
                        value: settings['numberOfRankingRounds'],
                        name: 'numberOfRankingRounds'
                    },
                    scheduleTimeOffset: {
                        display: 'Schedule offset',
                        value: moment(settings['scheduleTimeOffset']).utc().format('HH:mm'),
                        negative: false,
                        name: 'scheduleTimeOffset'
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
            this.saveCurrentMatch();
        } else if (setting === 'scheduleTimeOffset') {
            this.saveOffset();
        } else {
            this.defaultSaveSetting(setting);
        }
    }

    private saveCurrentMatch() {
        this.tournamentStatusService.setMatch(this.settings['currentMatch'].value).subscribe(() => {
            this.notification.success("Match saved successfully")
        }, (err) => {
            this.notification.error("Oh no! Something went wrong while trying to save match.")
        })
    }

    private saveOffset() {
        let offset = 0
        let negative = 1
        if (this.settings['scheduleTimeOffset'].value !== '') {
            if (this.settings['scheduleTimeOffset'].negative) {
                negative = -1
            }
            offset = moment.utc(this.settings['scheduleTimeOffset'].value, 'HH:mm').set({
                'year': 1970,
                'month': 0,
                'date': 1
            }).valueOf() * negative
        }
        this.tournamentSettingsService.saveSetting('scheduleTimeOffset', offset).subscribe(
            response => {
                this.notification.success(`${this.settings['scheduleTimeOffset'].display} saved successfully`)
            },
            error => {
                this.notification.error(`Oh no! Something went wrong while trying to save ${this.settings['scheduleTimeOffset'].display}`)
            })

    }

    private defaultSaveSetting(setting: string) {
        this.tournamentSettingsService.saveSetting(setting, this.settings[setting].value).subscribe(
            response => {
                this.notification.success(`${this.settings[setting].display} saved successfully`)
            },
            err => {
                this.notification.error("Oh no! Something went wrong while trying to save...")
            })
    }

    saveNumberOFRounds() {
        if (this.doesValueBetween(this.settings['numberOfPracticeRounds'].value, this.MIN_AMOUNT_OF_ROUNDS, this.MAX_AMOUNT_OF_ROUNDS) &&
            this.doesValueBetween(this.settings['numberOfRankingRounds'].value, this.MIN_AMOUNT_OF_ROUNDS, this.MAX_AMOUNT_OF_ROUNDS)) {
            forkJoin(this.tournamentSettingsService.saveSetting('numberOfPracticeRounds', this.settings['numberOfPracticeRounds'].value),
                this.tournamentSettingsService.saveSetting('numberOfRankingRounds', this.settings['numberOfRankingRounds'].value))
                .subscribe(
                    response => {
                        this.notification.success(`Number of rounds saved successfully`)
                    },
                    error => {
                        this.notification.error("Oh no! Something went wrong while trying to save number of rounds")
                    }
                )
        } else {
            this.notification.error(`Valid rounds per stage is between ${this.MIN_AMOUNT_OF_ROUNDS} and ${this.MAX_AMOUNT_OF_ROUNDS}`)
        }

    }

    doesValueBetween(value, min, max) {
        return value >= min && value <= max;
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


