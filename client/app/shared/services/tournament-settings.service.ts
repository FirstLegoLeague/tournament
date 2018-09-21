import {Injectable, OnInit} from '@angular/core';
import {RequestService} from "./request.service";
import {Observable} from "rxjs";
import {MessengerService} from "./messenger.service";

@Injectable({
    providedIn: 'root'
})
export class TournamentSettingsService implements OnInit {

    constructor(private request: RequestService, private messenger: MessengerService) {
    }

    ngOnInit(): void {
        this.messenger.on('tournamentStage:updated', this.getStages.bind(this))
    }

    getAllSettings(): Observable<any> {
        return this.request.get('/settings/all');
    }

    getStages(): Observable<any> {
        return this.request.get('/settings/stages');
    }

    saveSetting(settingName, value): Observable<any> {
        let data = {};
        data[settingName] = value;
        return this.request.put(`/settings/${settingName}`, data, {observe: 'response'});
    }
}
