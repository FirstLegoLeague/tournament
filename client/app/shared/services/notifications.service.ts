import { Injectable } from '@angular/core'
import { LoggerService } from './logger.service'

@Injectable({
  providedIn: 'root'
})
export class Notifications {

  constructor (private logger: LoggerService) {
  }

  notify (message: string, level: string) {
    // tslint:disable-next-line:no-unused-expression
    toastr[level](message)
  }

  success (message: string) {
    this.logger.info(`client notification: ${message}`)
    this.notify(message, 'success')
  }

  warning (message: string) {
    this.logger.warn(`client notification: ${message}`)
    this.notify(message, 'warning')
  }

  error (message: string) {
    this.logger.error(`client notification: ${message}`)
    this.notify(message, 'error')
  }

}
