import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { LogoUploadComponent } from './logo-upload.component'

describe('LogoUploadComponent', () => {
  let component: LogoUploadComponent
  let fixture: ComponentFixture<LogoUploadComponent>

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      declarations: [ LogoUploadComponent ]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoUploadComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
