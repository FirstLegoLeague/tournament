import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentStatus } from './tournament-status.component';

describe('TournamentStatus', () => {
  let component: TournamentStatus;
  let fixture: ComponentFixture<TournamentStatus>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TournamentStatus ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentStatus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
