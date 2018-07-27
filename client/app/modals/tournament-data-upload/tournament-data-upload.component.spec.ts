import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentDataUpload } from './tournament-data-upload.component';

describe('TournamentDataUpload', () => {
  let component: TournamentDataUpload;
  let fixture: ComponentFixture<TournamentDataUpload>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TournamentDataUpload ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentDataUpload);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
