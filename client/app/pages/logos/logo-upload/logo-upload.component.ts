import { Component } from '@angular/core'
import { UploadEvent, UploadFile, FileSystemFileEntry } from 'ngx-file-drop'

import { LogosService } from '../../../shared/services/resource_clients/logos.service'
import { Notifications } from '../../../shared/services/ui/notifications.service'
import { Logo } from '../../../../../resources/logo'

@Component({
  selector: 'logo-upload',
  templateUrl: './logo-upload.component.html',
  styleUrls: ['./logo-upload.component.css']
})
export class LogoUploadComponent {

  public file: UploadFile
  public content: string
  public fileHovering: Boolean
  public loading: Boolean
  public logo: Logo

  constructor (private logosService: LogosService, private notifications: Notifications) {
  }

  public imgSrc (): string {
    return this.logo.logo
  }

  public dropped (event: UploadEvent) {
    this.file = event.files[0]
    this.loading = true
    if (this.file.fileEntry.isFile) {
      const fileEntry = this.file.fileEntry as FileSystemFileEntry
      fileEntry.file((file: File) => {
        const fileReader = new FileReader()
        fileReader.onload = () => { this.upload(fileReader.result, file.name) }
        fileReader.readAsDataURL(file)
      })
    } else {
      this.file = null
    }
  }

  private upload (logo, name) {
    console.log(logo)
    this.logosService.create({ filename: name, source: logo }).subscribe(() => {
      this.notifications.success('Logo upload succeeded')
    },() => {
      this.notifications.error('Logo upload failed')
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
}
