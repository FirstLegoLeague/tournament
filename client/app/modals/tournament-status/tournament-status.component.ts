import { Component, OnInit } from '@angular/core';

import { Notifications } from '../../services/notifications.service';

@Component({
  selector: 'tournament-status',
  templateUrl: './tournament-status.component.html',
  styleUrls: ['./tournament-status.component.css']
})

export class TournamentStatus implements OnInit{
  constructor(private notifications: Notifications) {
  }

  ngOnInit() {}
}