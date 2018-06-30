import { Component, OnInit } from '@angular/core';
import {MatchesService} from '../../services/matches.service';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {

  matches = [];

  constructor(private matchesService: MatchesService) { }

  ngOnInit() {
    this.matchesService.getAllMatches().subscribe((date: any) =>{
      this.matches = date;
    });
  }

}
