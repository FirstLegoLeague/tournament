import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tables } from './tables.component';

describe('Tables', () => {
  let component: Tables;
  let fixture: ComponentFixture<Tables>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tables ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tables);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
