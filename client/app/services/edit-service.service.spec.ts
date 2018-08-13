import { TestBed, inject } from '@angular/core/testing';

import { EditServiceService } from './edit-service.service';

describe('EditServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EditServiceService]
    });
  });

  it('should be created', inject([EditServiceService], (service: EditServiceService) => {
    expect(service).toBeTruthy();
  }));
});
