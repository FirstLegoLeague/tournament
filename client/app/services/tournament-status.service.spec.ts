import { TestBed, inject } from '@angular/core/testing';

import { TournamentStatusService } from './tournament-status.service';

describe('TournamentStatusService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TournamentStatusService]
    });
  });

  it('should be created', inject([TournamentStatusService], (service: TournamentStatusService) => {
    expect(service).toBeTruthy();
  }));
});
