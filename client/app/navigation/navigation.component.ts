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
      { href: '/settings', title: 'Tournament Settings', icon: 'cogs' },
      { href: '/images', title: 'Images', icon: 'image outline' },
      { href: '/teams', title: 'Teams', icon: 'users' },
      { href: '/matches', title: 'Matches', icon: 'calendar alternate outline' }
  	]
  }

  ngOnInit () {
  	this.page = document.location.pathname
    if (this.page === '/') {
      document.location.pathname = this.links[0]['href']
    }
  }

  iconClass (link) {
  	return this.loading === link ? 'fa-circle-notch fa-spin' : link.icon
  }

}
