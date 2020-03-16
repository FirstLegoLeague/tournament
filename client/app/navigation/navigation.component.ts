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
      { href: '/home', title: 'Home', icon: 'home' }
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
