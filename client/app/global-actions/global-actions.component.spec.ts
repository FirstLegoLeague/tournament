import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { GlobalActions } from './global-actions.component'

describe('GlobalActions', () => {
  let component: GlobalActions
  let fixture: ComponentFixture<GlobalActions>

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      declarations: [ GlobalActions ]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalActions)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
