import { Injectable } from '@angular/core'
import { CollectionClient } from '@first-lego-league/synced-resources'
import { Observable } from 'rxjs'

import { Image } from '../../../../resources/image'

@Injectable({
  providedIn: 'root'
})
export class ImagesService extends CollectionClient {
	constructor () {
		super(Image, '/images')
	}
}