import { TestBed, inject } from '@angular/core/testing';

import { TournamentSettingsService } from './tournament-settings.service';

describe('TournamentSettingsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TournamentSettingsService]
    });
  });

  it('should be created', inject([TournamentSettingsService], (service: TournamentSettingsService) => {
    expect(service).toBeTruthy();
  }));
});
