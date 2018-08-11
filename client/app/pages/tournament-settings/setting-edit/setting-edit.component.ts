import {Component, Input, OnInit} from '@angular/core';
import {TournamentSettingsService} from "../../../services/tournament-settings.service";
import { Notifications } from '../../../services/notifications.service';

@Component({
  selector: 'app-setting-edit',
  templateUrl: './setting-edit.component.html',
  styleUrls: ['./setting-edit.component.css']
})
export class SettingEditComponent implements OnInit {

  @Input() setting: object

  constructor(private tournamentSettingsService: TournamentSettingsService, private notification: Notifications) { }

  ngOnInit() {
  }

  save(){
    // @ts-ignore
      this.tournamentSettingsService.saveSetting(this.setting.name, this.setting.value).subscribe((response,err) => {
      if(err){
          this.notification.error("Oh no! Something went wrong while trying to save...")
      } else{
          this.notification.success("Setting saved successfully")
      }
    })
  }

}
