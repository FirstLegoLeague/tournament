import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { TeamsUpload } from './teams-upload.component'

describe('TeamsUpload', () => {
  let component: TeamsUpload
  let fixture: ComponentFixture<TeamsUpload>

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      declarations: [ TeamsUpload ]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamsUpload)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
