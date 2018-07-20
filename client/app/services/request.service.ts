import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RequestService {

  base_url: string = 'http://localhost:3001';

  constructor(private http: HttpClient) {
  }

  get(endpoint: string) {
    return this.http.get(this.base_url + endpoint);
  }

}
