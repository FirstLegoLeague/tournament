import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ModelDelete } from './model-delete.component'

describe('ModelDelete', () => {
  let component: ModelDelete
  let fixture: ComponentFixture<ModelDelete>

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      declarations: [ ModelDelete ]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelDelete)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
