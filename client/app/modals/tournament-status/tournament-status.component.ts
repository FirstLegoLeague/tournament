import { Component, OnInit } from '@angular/core';

import { Notifications } from '../../services/notifications.service';

import { TournamentStatusService } from '../../services/tournament-status.service';

@Component({
  selector: 'tournament-status',
  templateUrl: './tournament-status.component.html',
  styleUrls: ['./tournament-status.component.css']
})

export class TournamentStatus implements OnInit{
  constructor(private notifications: Notifications, private tournamentStatusService: TournamentStatusService) {
  }

  ngOnInit() {}
}