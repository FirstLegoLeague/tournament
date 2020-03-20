import { Component, OnInit } from '@angular/core'
import { SettingsService } from '../../shared/services/resource_clients/settings.service'
import { MatchesService } from '../../shared/services/resource_clients/matches.service'
import { TeamsService } from '../../shared/services/resource_clients/teams.service'
import { StatusService } from '../../shared/services/resource_clients/status.service'
import { Notifications } from '../../shared/services/ui/notifications.service'
import { DropdownService } from '../../shared/services/ui/dropdown.service'
import { DeleteService } from '../../shared/services/delete.service'
import { ScheduleService } from '../../shared/services/schedule.service'
import { forkJoin } from 'rxjs'
import * as moment from 'moment'

@Component({
  selector: 'app-tournament-settings',
  templateUrl: './tournament-settings.component.html',
  styleUrls: ['./tournament-settings.component.css']
})
export class TournamentSettingsComponent implements OnInit {

  public loading: boolean = true
  public hasDataInDb = false
  public hasMatches = false

  public currentStageOptions: any[]

  public MIN_AMOUNT_OF_ROUNDS = 0
  public MAX_AMOUNT_OF_ROUNDS = 5

  constructor (private settingsService: SettingsService,
                private notification: Notifications,
                private dropdownService: DropdownService,
                private deleteModalsService: DeleteService,
                private statusService: StatusService,
                private matchesService: MatchesService,
                private teamsService: TeamsService,
                private scheduleService: ScheduleService) {
  }

  ngOnInit () {
    this.scheduleService.subscribe(() => {
      this.checkDataInDb()
    })

    forkJoin([this.settingsService.init(), this.statusService.init()]).subscribe({
      next: () => {
        this.checkDataInDb()
        this.matchesService.init().subscribe(
          () => {
            this.currentStageOptions = this.matchesService.data()
              .map(match => match.stage)
              .reduce((stages, stage) => stages.includes(stage) ? stages : stages.concat([stage]), [])
              this.dropdownService.dropdown('#stage-dropdown')
              this.loading = false
          },
          () => this.notification.error('An error occurred while trying to load stages. \n Maybe you did not load any matches?'),
          () => this.loading = false
        )
      },
      error: () => this.notification.error('There was a problem getting the settings.')
    })
  }

  saveNumberOfRounds () {
    if (this.valueInRange(this.settingsService.data().numberOfPracticeRounds, this.MIN_AMOUNT_OF_ROUNDS, this.MAX_AMOUNT_OF_ROUNDS) &&
            this.valueInRange(this.settingsService.data().numberOfRankingRounds, this.MIN_AMOUNT_OF_ROUNDS, this.MAX_AMOUNT_OF_ROUNDS)) {
      forkJoin([this.save('numberOfPracticeRounds'), this.save('numberOfRankingRounds')]) .subscribe(
        () => this.notification.success(`Number of rounds saved successfully`),
        () => this.notification.error('Oh no! Something went wrong while trying to save number of rounds'))
    } else {
      this.notification.error(`Valid rounds per stage is between ${this.MIN_AMOUNT_OF_ROUNDS} and ${this.MAX_AMOUNT_OF_ROUNDS}`)
    }

  }

  save (setting: string) {
    let observable
    if (this.settingsService.data().hasOwnProperty(setting)) {
      observable = this.settingsService.update({ [setting]: this.settingsService.data()[setting] })
    } else if (this.statusService.data().hasOwnProperty(setting)) {
      observable = this.statusService.update({ [setting]: this.statusService.data()[setting] })
    }

    if (observable) {
      observable.subscribe(
        () => this.notification.success('Settings saved successfully'),
        err => this.notification.error(err.error.error))
    }
  }

  valueInRange (value, min, max) {
    return value >= min && value <= max
  }

  openClearScheduleModal () {
    // This is breaking Liskov's Substitution Principle
    this.deleteModalsService.openModalFor({ id: () => '' }, this.scheduleService)
  }

  checkDataInDb () {
    this.hasDataInDb = false
    this.hasMatches = false
    this.teamsService.init().subscribe(() => {
      this.hasDataInDb = this.hasDataInDb || (this.teamsService.data().length !== 0)
    })
    this.matchesService.init().subscribe(() => {
      this.hasMatches = (this.matchesService.data().length !== 0)
      this.hasDataInDb = this.hasDataInDb || this.hasMatches
    })
  }
}
