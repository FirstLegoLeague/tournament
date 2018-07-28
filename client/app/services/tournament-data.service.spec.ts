import { TestBed, inject } from '@angular/core/testing';

import { TournamentDataService } from './tournament-data.service';

describe('TournamentDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TournamentDataService]
    });
  });

  it('should be created', inject([TournamentDataService], (service: TournamentDataService) => {
    expect(service).toBeTruthy();
  }));
});
