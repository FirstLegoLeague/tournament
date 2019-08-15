import { Injectable } from '@angular/core'

declare var jQuery: any

@Injectable({
  providedIn: 'root'
})
export class ModalsService {
  modal (id) {
  	let selector = `#${id}`
    return {
      open: () => jQuery(selector).modal().modal('show'),
      close: () => jQuery(selector).modal().modal('hide')
    }
  }
}
