import {Component, Input, OnInit} from '@angular/core';
import {TournamentSettingsService} from "../../../services/tournament-settings.service";

@Component({
  selector: 'app-setting-edit',
  templateUrl: './setting-edit.component.html',
  styleUrls: ['./setting-edit.component.css']
})
export class SettingEditComponent implements OnInit {

  @Input() setting: object

  constructor(private tournamentSettingsService: TournamentSettingsService) { }

  ngOnInit() {
  }

  save(){
    // @ts-ignore
      this.tournamentSettingsService.saveSetting(this.setting.name, this.setting.value).subscribe(value => {
        console.log(value)
    })
  }

}
