import { Component } from '@angular/core';
import { UploadEvent, UploadFile } from 'ngx-file-drop';

@Component({
  selector: 'teams-upload',
  templateUrl: './teams-upload.component.html',
  styleUrls: ['./teams-upload.component.css']
})
export class TeamsUpload {

  public file: UploadFile;
  public loading: Boolean;

  constructor() {
  }

  public dropped(event: UploadEvent) {
  	this.file = event.files[0]
    this.loading = true
  }

}
