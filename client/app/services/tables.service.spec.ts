import { TestBed, inject } from '@angular/core/testing';

import { TablesService } from './tables.service';

describe('TablesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TablesService]
    });
  });

  it('should be created', inject([TablesService], (service: TablesService) => {
    expect(service).toBeTruthy();
  }));
});
