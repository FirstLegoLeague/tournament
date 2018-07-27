import { Component, OnInit } from '@angular/core';
import { UploadEvent, UploadFile } from 'ngx-file-drop';

@Component({
  selector: 'tournament-data-upload',
  templateUrl: './tournament-data-upload.component.html',
  styleUrls: ['./tournament-data-upload.component.css']
})
export class TournamentDataUpload implements OnInit {

  public file: UploadFile;
  public isFileOver: Boolean;

  constructor() {
  }

  ngOnInit() {
  }

  public dropped(event: UploadEvent) {
  	this.file = event.files[0]
  }

  public fileOver(event){
    this.isFileOver = true
  }

  public fileLeave(event){
    this.isFileOver = false
  }

}
