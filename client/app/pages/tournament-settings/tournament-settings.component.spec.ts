import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentSettingsComponent } from './tournament-settings.component';

describe('TournamentSettingsComponent', () => {
  let component: TournamentSettingsComponent;
  let fixture: ComponentFixture<TournamentSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TournamentSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
