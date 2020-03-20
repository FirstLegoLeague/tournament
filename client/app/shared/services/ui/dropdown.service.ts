import { Injectable } from '@angular/core'

declare var jQuery: any

@Injectable({
  providedIn: 'root'
})
export class DropdownService {
  dropdown (selector) {
  	setTimeout(() => jQuery(selector).dropdown())
  }
}
