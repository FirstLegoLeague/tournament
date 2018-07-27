import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalAction } from './global-actions.component';

describe('GlobalAction', () => {
  let component: GlobalAction;
  let fixture: ComponentFixture<GlobalAction>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalAction ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalAction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
