import { Component, OnInit } from '@angular/core';

import { TablesService } from '../../services/resource_clients/tables.service'

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  constructor (private tables: TablesService) {
  	this.tables = tables
  }

  ngOnInit() {
  	this.tables.init()
  }
}
