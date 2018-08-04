import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient) {
  }

  get(endpoint: string) {
    return this.http.get(endpoint);
  }

  post(endpoint: string, data: any, headers: any) {
    return this.http.post(endpoint, data, headers);
  }

  delete(endpoint: string, headers: any) {
    return this.http.delete(endpoint, headers);
  }

}
