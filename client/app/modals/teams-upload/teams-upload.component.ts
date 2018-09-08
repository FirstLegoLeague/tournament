import { Component } from '@angular/core';
import { UploadEvent, UploadFile, FileSystemFileEntry } from 'ngx-file-drop';

import { ParserService } from '../../services/parser.service';
import { TeamsService } from '../../services/teams.service';
import { Notifications } from '../../services/notifications.service';
import { Team } from '../../models/team';

@Component({
  selector: 'teams-upload',
  templateUrl: './teams-upload.component.html',
  styleUrls: ['./teams-upload.component.css']
})
export class TeamsUpload {

  public file: UploadFile;
  public content: string;
  public fileHovering: Boolean;
  public loading: Boolean;
  public teams: Array<Team>;

  constructor(private parser: ParserService, private teamsService: TeamsService, private notifications: Notifications) {
  }

  public dropped(event: UploadEvent) {
  	this.file = event.files[0]
    this.loading = true
    if (this.file.fileEntry.isFile) {
      const fileEntry = this.file.fileEntry as FileSystemFileEntry;
      fileEntry.file((file: File) => {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
          this.content = fileReader.result
          this.parser.parseTeams(this.content).subscribe((data: any) =>{
            if(data['error']){
              this.notifications.error(`Parsing of teams file failed.\n${data['error']}.`);
              this.close();
              this.loading = false;
            }else{
              this.teams = data['teams'];
            }
          }, error => {
            this.notifications.error('Teams parsing failed');
          }, () => {
            this.loading = false;
          });
        }
        fileReader.readAsText(file, "UTF-8");
      });
    } else {
      this.file = null
    }
  }

  public upload(event) {
    this.loading = true
    this.teamsService.uploadBatch(this.content).subscribe(() => {
      this.notifications.success('Teams imported');
      this.close();
      this.loading = false;
      this.teamsService.reload();
    }, error => {
      this.notifications.error('Teams import failed');
      this.close();
      this.loading = false;
    });
  }

  public fileOver(event) {
    this.fileHovering = true;
  }

  public fileLeave(event) {
    this.fileHovering = false;
  }

  public close() {
    document.getElementById('teams-close-button').click();
  }

}
