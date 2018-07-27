import { Component } from '@angular/core';
import { UploadEvent, UploadFile } from 'ngx-file-drop';

@Component({
  selector: 'tournament-data-upload',
  templateUrl: './tournament-data-upload.component.html',
  styleUrls: ['./tournament-data-upload.component.css']
})
export class TournamentDataUpload {

  public file: UploadFile;
  public fileHovering: Boolean;
  public loading: Boolean;

  constructor() {
  }

  public dropped(event: UploadEvent) {
  	this.file = event.files[0]
    this.loading = true
  }
  
  public fileOver(event){
    this.fileHovering = true
  }
 
  public fileLeave(event){
    this.fileHovering = false
  }

}
