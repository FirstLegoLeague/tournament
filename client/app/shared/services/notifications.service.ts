import { Injectable } from '@angular/core'
import { LoggerService } from './logger.service'

@Injectable({
  providedIn: 'root'
})
export class Notifications {

  constructor (private logger: LoggerService) {
  }

  notify (message: string, level: string) {
    Foundation.Notification(message, level)
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
