import { Injectable } from '@angular/core';
import {RequestService} from "./request.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TournamentSettingsService {

  constructor(private request: RequestService) { }

  getAllSettings() : Observable<any>{
      return this.request.get('/settings/all');
  }

  getStages(): Observable<any>{
      return this.request.get('/settings/stages');
  }

  saveSetting(settingName, value): Observable<any>{
      let data = {};
      data[settingName] = value;
      return this.request.put(`/settings/${settingName}`, data, { observe: 'response' });
  }
}
