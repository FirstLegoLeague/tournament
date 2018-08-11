import { TestBed, inject } from '@angular/core/testing';

import { DeleteServiceService } from './delete-service.service';

describe('DeleteServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeleteServiceService]
    });
  });

  it('should be created', inject([DeleteServiceService], (service: DeleteServiceService) => {
    expect(service).toBeTruthy();
  }));
});
