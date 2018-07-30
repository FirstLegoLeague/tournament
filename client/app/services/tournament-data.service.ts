import {Injectable} from '@angular/core';
import {RequestService} from './request.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TournamentDataService {

  constructor(private request: RequestService) {
  }

  upload(data: string) : Observable<any>{
    return this.request.post('/tournamentData', { delimiter: ',', tourData: data }, { responseType: 'text' })
  }

}
