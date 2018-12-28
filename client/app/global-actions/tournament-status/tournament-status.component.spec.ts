import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentStatusComponent } from './tournament-status.component';

describe('TournamentStatusComponent', () => {
  let component: TournamentStatusComponent;
  let fixture: ComponentFixture<TournamentStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TournamentStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
