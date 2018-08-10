import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Notifications {

	notify(message: string, level: string) {
		new Foundation.Notification(message, level);
	}

	success (message: string) {
		this.notify(message, 'success')
	}

	warning (message: string) {
		this.notify(message, 'warning')
	}

	error (message: string) {
		this.notify(message, 'error')
	}

}
