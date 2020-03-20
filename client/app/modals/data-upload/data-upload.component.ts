import { Component, OnInit, Input } from '@angular/core'
import { UploadEvent, UploadFile, FileSystemFileEntry } from 'ngx-file-drop'
import { forkJoin } from 'rxjs'

import { ScheduleService } from '../../shared/services/schedule.service'

import { TeamsService } from '../../shared/services/resource_clients/teams.service'
import { MatchesService } from '../../shared/services/resource_clients/matches.service'

import { Notifications } from '../../shared/services/ui/notifications.service'
import { ModalsService } from '../../shared/services/ui/modals.service'

import { LoggerService } from '../../shared/services/utils/logger.service'

declare var jQuery: any

@Component({
  selector: 'data-upload',
  templateUrl: './data-upload.component.html',
  styleUrls: ['./data-upload.component.css']
})
export class DataUpload implements OnInit {
  public rawData: string
  public fileHovering: Boolean
  public loading: Boolean
  public data: any
  @Input() public hasData: boolean = true
  modal: any

  constructor (private scheduleService: ScheduleService,
              private teamsService: TeamsService,
              private matchesService: MatchesService,
              private notifications: Notifications,
              private logger: LoggerService,
              private modalsService: ModalsService) {
    this.modal = modalsService.modal('data-upload')
  }

  ngOnInit () {
    this.scheduleService.subscribe(() => {
      this.checkDataInDb()
    })

    this.checkDataInDb()
  }

  public dropped (event: UploadEvent) {
    const file = event.files[0]
    this.loading = true
    if (file.fileEntry.isFile) {
      const fileEntry = file.fileEntry as FileSystemFileEntry
      fileEntry.file((file: File) => {
        const fileReader = new FileReader()
        fileReader.onload = () => { this.parse(fileReader.result) }
        fileReader.readAsText(file, 'UTF-8')
      })
    }
  }

  public upload (event) {
    this.loading = true
    this.scheduleService.upload(this.rawData).subscribe(
      () => this.notifications.success('Schedule file imported'),
      () => this.notifications.error('Schedule file import failed'),
      () => this.close())
  }

  public fileOver (event) {
    this.fileHovering = true
  }

  public fileLeave (event) {
    this.fileHovering = false
  }

  open () {
    this.modal.open()
  }

  close () {
    this.modal.close()
    this.rawData = null
    this.fileHovering = false
    this.loading = false
    this.data = null
  }

  public timeString (dateString) {
    return dateString.match(/T(.+)Z/)[1]
  }

  public showTeamsList () {
    return this.data && !this.data.matches
  }

  public showFullSchedule () {
    return this.data && this.data.matches
  }

  private parse (str) {
    this.rawData = str
    this.scheduleService.parse(this.rawData)
    .subscribe((response: any) => {
      const data = response.data
      if (data['error']) {
        this.notifications.error(`Parsing of Schedule file failed.\n${data['error']}.`)
        this.close()
      } else {
        this.data = data
        this.loading = false
      }
    }, error => {
      this.notifications.error('Parsing of Schedule file failed')
      this.close()
    })
  }

  private checkDataInDb () {
    this.hasData = false
    forkJoin([this.teamsService.init(), this.matchesService.init()]).subscribe(
      () => { this.hasData = (this.teamsService.data().length > 0) || (this.matchesService.data().length > 0) },
      () => { this.hasData = true })
  }
}
