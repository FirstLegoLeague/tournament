import { Component } from '@angular/core'
import { UploadEvent, UploadFile, FileSystemFileEntry } from 'ngx-file-drop'

import { ParserService } from '../../services/parser.service'
import { ImagesService } from '../../services/images.service'
import { Notifications } from '../../services/notifications.service'
import { Image } from '../../models/image'

@Component({
  selector: 'image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent {

  public file: UploadFile
  public content: string
  public fileHovering: Boolean
  public loading: Boolean
  public image: Image

  constructor (private parser: ParserService, private imagesService: ImagesService, private notifications: Notifications) {
  }

  public imgSrc (): string {
    return this.image.image
  }

  public dropped (event: UploadEvent) {
    this.file = event.files[0]
    this.loading = true
    if (this.file.fileEntry.isFile) {
      const fileEntry = this.file.fileEntry as FileSystemFileEntry
      fileEntry.file((file: File) => {
        const fileReader = new FileReader()
        const name = file.name
        const image = new Image()
        fileReader.onload = (e) => {
          image.name = name
          image.image = fileReader.result
          this.content = image.image

          if (/*Not*/!this.imagesService.images.find((tempImg: Image) => tempImg.name === name)) {
            this.loading = false
            this.close()
            this.imagesService.images.push(image)
            debugger;
          }
          //TODO: Error handling
        }
        fileReader.readAsText(file, 'UTF-8')
      })
    } else {
      this.file = null
    }
  }

  //
  // public upload(event) {
  //   this.loading = true
  //   this.teamsService.uploadBatch(this.content).subscribe(() => {
  //     this.notifications.success('Teams uploaded');
  //     this.close();
  //     this.loading = false;
  //     this.teamsService.reload();
  //   }, error => {
  //     this.notifications.error('Teams upload failed');
  //     this.close();
  //     this.loading = false;
  //   });
  // }
  public alert (thing) {
    alert(thing)
  }

  public fileOver (event) {
    this.fileHovering = true
  }

  public fileLeave (event) {
    this.fileHovering = false
  }

  public close () {
    document.getElementById('teams-close-button').click()
  }

}
