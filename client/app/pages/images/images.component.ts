import { Component, OnInit } from '@angular/core';

import { ImagesService } from '../../services/images.service'
import { DeleteService } from '../../services/delete-service.service'

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css']
})
export class ImagesComponent implements OnInit {

  constructor(private imageService: ImagesService, private modelModalsService: DeleteService) { }

  ngOnInit() {
    this.imageService.init();
  }

  images() {
    return this.imageService.images;
  }

  setDeleteModel(image) {
    this.modelModalsService.setDeleteModel(image);
  }
}
