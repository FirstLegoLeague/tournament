import { Component, OnInit } from '@angular/core';
import {MatchesService} from '../../services/matches.service';
import {RequestService} from '../../services/request.service';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {

  matches = [];
  tables = [];

  constructor(private matchesService: MatchesService, private requests: RequestService) { }

  ngOnInit() {
    this.matchesService.getAllMatches().subscribe((date: any) =>{
      this.matches = date;
    });

    this.requests.get('/table/all').subscribe((data: any) =>{
      this.tables = data;
    });
  }

}
