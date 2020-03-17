import { Component, OnInit, Input } from '@angular/core'
import { UploadEvent, UploadFile, FileSystemFileEntry } from 'ngx-file-drop'
import { forkJoin } from 'rxjs'

import { Team } from '../../models/team'
import { ParserService } from '../../services/parser.service'
import { TournamentDataService } from '../../services/tournament-data.service'
import { TeamsService } from '../../services/teams.service'
import { MatchesService } from '../../services/matches.service'
import { Notifications } from '../../services/notifications.service'
import { LoggerService } from '../../services/logger.service'
import { ModalsService } from '../../services/modals.service'

declare var jQuery: any

@Component({
  selector: 'app-schedule-modal',
  templateUrl: './schedule-modal.component.html',
  styleUrls: ['./schedule-modal.component.css']
})
export class ScheduleModalComponent implements OnInit {
  public file: UploadFile
  public content: string
  public fileHovering: Boolean
  public loading: Boolean
  public data: any
  public teams: Array<Team>
  @Input() public hasData: boolean = true
  modal: any

  constructor (private scheduleParser: ScheduleParsingService,
              private teamsService: TeamsService,
              private matchesService: MatchesService,
              private notifications: Notifications,
              private logger: LoggerService,
              private modalsService: ModalsService) {
    this.modal = modalsService.modal('data-upload')
  }

  ngOnInit () {
    this.checkForData()
      .subscribe(() => {
        if (!this.hasData) {
          this.open()
        }
      })
  }

  public dropped (event: UploadEvent) {
    this.file = event.files[0]
    if (!this.file.fileEntry.isFile) {
      this.file = null
      return
    }

    if (!this.file.fileEntry.name.endsWith('.csv')) {
      this.notifications.error('File must be a CSV file')
      this.file = null
      return
    }

    this.loading = true
    this.fileContent().then(fileContent => {
      this.parse(fileContent)
    })
  }

  public upload (event) {
    this.loading = true
    this.scheduleParser.upload(this.content)
      .subscribe(
        () => this.notifications.success('Schedule file imported'),
        () => this.notifications.error('Schedule file import failed'),
        () => { this.loading = false }
      )
  }

  private parse (content) {
    this.content = content
    this.scheduleParser.parse(content)
      .subscribe((data: any) => {
        if (data['error']) {
          this.notifications.error(`Parsing of Schedule file failed.\n${data['error']}.`)
          this.close()
        } else {
          this.data = data
        }
      }, () => {
        this.notifications.error('Parsing of Schedule file failed')
        this.close()
      }, () => {
        this.loading = false
      })
  }

  public fileOver (event) {
    this.fileHovering = true
  }

  public fileLeave (event) {
    this.fileHovering = false
  }

  private fileContent () {
    return new Promise(resolve => {
      const fileEntry = this.file.fileEntry as FileSystemFileEntry
      fileEntry.file((file: File) => {
        const fileReader = new FileReader()
        fileReader.onload = () => resolve(fileReader.result)
        fileReader.readAsText(file, 'UTF-8')
      })
    })
  }

  open () {
    this.modal.open()
  }

  close () {
    this.modal.close()
    this.file = null
    this.content = null
    this.fileHovering = false
    this.loading = false
    this.data = null
    this.teams = null
  }

  public timeString (dateString) {
    return dateString.match(/T(.+)Z/)[1]
  }

  private checkForData () {
    forkJoin([this.teamsService.init(), this.matchService.init()]).subscribe(
      data => {
        let teams = this.teamsService.client.data
        let matches = this.matchesService.client.data
        // @ts-ignore
        this.hasData = (teams.length > 0) || (matches.length > 0)
      },
      () => {
        this.hasData = true
      })
  }
}
