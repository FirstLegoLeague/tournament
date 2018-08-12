import {Component, Input, OnInit} from '@angular/core';
import {TournamentSettingsService} from "../../../services/tournament-settings.service";
import { Notifications } from '../../../services/notifications.service';
import { TournamentStatusService } from '../../../services/tournament-status.service';

@Component({
  selector: 'app-setting-edit',
  templateUrl: './setting-edit.component.html',
  styleUrls: ['./setting-edit.component.css']
})
export class SettingEditComponent implements OnInit {

  @Input() setting: any
    public loading: boolean = true;

  constructor(private tournamentSettingsService: TournamentSettingsService, private notification: Notifications, private tournamentStatusService: TournamentStatusService) { }

  ngOnInit() {
  }

  save(){
      if(this.setting.name === 'tournamentMatch'){
        this.matchSave()
      }else{
        this.settingSave()
    }
  }

  matchSave(){
    if(isNaN(this.setting.value) || this.setting.value < 0 || this.setting.value > 5000){
      this.notification.error("Please enter a legitimate number!")
      return
    }

    // @ts-ignore
    this.tournamentStatusService.setMatch(this.setting.value).subscribe((response,err) => {
      if(err){
          this.notification.error("Oh no! Something went wrong while trying to save...")
      } else{
          this.loading = false;
          this.notification.success("Setting saved successfully")
      }
    })
  }

  settingSave(){
    // @ts-ignore
      this.tournamentSettingsService.saveSetting(this.setting.name, this.setting.value).subscribe((response,err) => {
      if(err){
          this.notification.error("Oh no! Something went wrong while trying to save...")
      } else{
          this.loading = false;
          this.notification.success("Setting saved successfully")
      }
    })
  }

}
