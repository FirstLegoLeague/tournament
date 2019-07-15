import { Component, OnInit, Input } from '@angular/core'
import { UploadEvent, UploadFile, FileSystemFileEntry } from 'ngx-file-drop'
import { forkJoin } from 'rxjs'

import { FileType } from '../../enums/file-type'
import { Team } from '../../models/team'
import { ParserService } from '../../services/parser.service'
import { TournamentDataService } from '../../services/tournament-data.service'
import { TeamsService } from '../../services/teams.service'
import { MatchesService } from '../../services/matches.service'
import { Notifications } from '../../services/notifications.service'
import { LoggerService } from '../../services/logger.service'

declare var jQuery: any

@Component({
  selector: 'data-upload',
  templateUrl: './data-upload.component.html',
  styleUrls: ['./data-upload.component.css']
})
export class DataUpload implements OnInit {
  public file: UploadFile
  public content: string
  public fileHovering: Boolean
  public loading: Boolean
  public data: any
  public teams: Array<Team>
  public fileType: FileType
  @Input() public hasData: boolean = true

  constructor (private parser: ParserService,
              private teamsService: TeamsService,
              private matchService: MatchesService,
              private tournamentDataService: TournamentDataService,
              private notifications: Notifications,
              private logger: LoggerService) {
  }

  ngOnInit () {
    this.load()
    this.tournamentDataService.dataReload.subscribe(() => {
      this.load()
    })
  }

  public dropped (event: UploadEvent) {
    this.file = event.files[0]
    this.loading = true
    if (this.file.fileEntry.isFile) {
      const fileEntry = this.file.fileEntry as FileSystemFileEntry
      fileEntry.file((file: File) => {
        const fileReader = new FileReader()
        fileReader.onload = (e) => {
          this.content = fileReader.result
          if (this.content.startsWith('Version Number', 0)) {
            this.fileType = FileType.Schedule
            this.parseSchedule()
          } else {
            this.fileType = FileType.TeamList
            this.parseTeamList()
          }
        }
        fileReader.readAsText(file, 'UTF-8')
      })
    } else {
      this.file = null
    }
  }

  public upload (event) {
    this.loading = true
    if (this.fileType === FileType.Schedule) {
      this.uploadSchedule()
    } else if (this.fileType === FileType.TeamList) {
      this.uploadTeamList()
    }
  }

  public fileOver (event) {
    this.fileHovering = true
  }

  public fileLeave (event) {
    this.fileHovering = false
  }

  public close () {
    jQuery('.data-upload').modal('hide')
  }

  public clearModal () {
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

  private load () {
    forkJoin([this.teamsService.requestAll(), this.matchService.requestAll()]).subscribe(
            data => {
              let teams = data[0]
              let matches = data[1]
                // @ts-ignore
              this.hasData = (teams.length > 0) || (matches.length > 0)
            },
            () => {
              this.hasData = true
            })
  }

  private parseSchedule () {
    this.parser.parseTournamentData(this.content)
    .subscribe((data: any) => {
      if (data['error']) {
        this.logger.error(`Parsing of Schedule file failed.\n${data['error']}.`)
        this.notifications.error(`Parsing of Schedule file failed.\n${data['error']}.`)
        this.close()
        this.loading = false
      } else {
        this.data = data
      }
    }, error => {
      this.logger.error('Parsing of Schedule file failed:' + error)
      this.notifications.error('Parsing of Schedule file failed')
      this.close()
      this.loading = false
    }, () => {
      this.loading = false
    })
  }

  private parseTeamList () {
    this.parser.parseTeams(this.content)
    .subscribe((data: any) => {
      if (data['error']) {
        this.logger.error(`Parsing of teams file failed.\n${data['error']}.`)
        this.notifications.error(`Parsing of teams file failed.\n${data['error']}.`)
        this.close()
        this.loading = false
      } else {
        this.teams = data['teams']
      }
    }, error => {
      this.logger.error('Teams parsing failed:' + error)
      this.notifications.error('Teams parsing failed')
    }, () => {
      this.loading = false
    })
  }

  private uploadSchedule () {
    this.tournamentDataService.upload(this.content)
    .subscribe(() => {
      this.logger.info('Schedule file imported')
      this.notifications.success('Schedule file imported')
      this.close()
      this.loading = false
      this.tournamentDataService.reload()
      .subscribe()
    }, error => {
      this.logger.error('Schedule file import failed:' + error)
      this.notifications.error('Schedule file import failed')
      this.close()
      this.loading = false
    })
  }

  private uploadTeamList () {
    this.teamsService.uploadBatch(this.content)
    .subscribe(() => {
      this.logger.info('Teams imported')
      this.notifications.success('Teams imported')
      this.close()
      this.loading = false
      this.tournamentDataService.reload()
      .subscribe()
    }, error => {
      this.logger.error('Teams import failed:' + error)
      this.notifications.error('Teams import failed')
      this.close()
      this.loading = false
    })
  }

}
