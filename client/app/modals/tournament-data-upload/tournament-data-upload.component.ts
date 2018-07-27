import { Component } from '@angular/core';
import { UploadEvent, UploadFile } from 'ngx-file-drop';

@Component({
  selector: 'tournament-data-upload',
  templateUrl: './tournament-data-upload.component.html',
  styleUrls: ['./tournament-data-upload.component.css']
})
export class TournamentDataUpload {

  public file: UploadFile;
  public loading: Boolean;

  constructor() {
  }

  public dropped(event: UploadEvent) {
  	this.file = event.files[0]
    this.loading = true
  }

}
