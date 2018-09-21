import {Injectable} from '@angular/core';
import {RequestService} from "./request.service";

@Injectable({
    providedIn: 'root'
})
export class LoggerService {

    constructor(private request: RequestService) {
    }

    private log(level, message) {
        this.request.post(`/log/${level}`, {message: message}).subscribe()
    }

    debug(message) {
        this.log('debug', message)
    }

    info(message) {
        this.log('info', message)
    }

    error(message) {
        this.log('error', message)
    }

    warn(message) {
        this.log('warn', message)
    }

    fatal(message) {
        this.log('fatal', message)
    }
}
