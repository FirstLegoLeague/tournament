import { Component, OnInit } from '@angular/core'

import { LogosService } from '../../shared/services/resource_clients/logos.service'
import { DeleteService } from '../../shared/services/delete.service'

@Component({
  selector: 'app-logos',
  templateUrl: './logos.component.html',
  styleUrls: ['./logos.component.css']
})
export class LogosComponent implements OnInit {

  public loading: boolean = true
  constructor (private logosService: LogosService, private deleteService: DeleteService) { }

  ngOnInit () {
    this.logosService.init().subscribe(() => {
      this.loading = false
    })
  }

  logos () {
    return this.logosService.data()
  }

  setDeleteModel (logo) {
    this.deleteService.openModalFor(logo, this.logosService)
  }
}
