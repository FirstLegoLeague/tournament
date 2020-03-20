import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  public links: Array<Object>
  public page: String
  public loading: Object

  constructor () {
  	this.links = [
      { href: '/tournament-settings', title: 'Tournament Settings', icon: 'cogs' },
      { href: '/tournament-logos', title: 'Sponsor Logos', icon: 'image outline' },
      { href: '/tournament-teams', title: 'Teams', icon: 'users' },
      { href: '/tournament-matches', title: 'Matches', icon: 'calendar alternate outline' }
  	]
  }

  ngOnInit () {
  	this.page = document.location.pathname
    if (this.page === '/') {
      document.location.pathname = this.links[0]['href']
    }
  }

  loadingOrIconClass (link) {
  	return this.loading === link ? 'notched circle loading' : link.icon
  }

}
