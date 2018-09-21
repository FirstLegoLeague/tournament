import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelEdit } from './model-edit.component';

describe('ModelEdit', () => {
  let component: ModelEdit;
  let fixture: ComponentFixture<ModelEdit>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelEdit ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
