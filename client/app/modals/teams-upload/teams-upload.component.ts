import { Component } from '@angular/core';
import { UploadEvent, UploadFile } from 'ngx-file-drop';

import { parseTeams } from '../../services/parsers.service';
import { Team } from '../../models/team';

@Component({
  selector: 'teams-upload',
  templateUrl: './teams-upload.component.html',
  styleUrls: ['./teams-upload.component.css']
})
export class TeamsUpload {

  public file: UploadFile;
  public loading: Boolean;
  public teams: Array<Team>;

  constructor() {
  }

  public dropped(event: UploadEvent) {
  	this.file = event.files[0]
    this.loading = true
    parseTeams(file).subscribe((data: any) =>{
      this.teams = data;
      this.loading = false;
    });
  }

}
