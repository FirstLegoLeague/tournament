import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { DataUpload } from './data-upload.component'
import { LoggerService } from '../../services/logger.service'
import { ErrorHandler } from '@angular/core'

describe('DataUpload', () => {
  let component: DataUpload
  let fixture: ComponentFixture<DataUpload>
  let logger: LoggerService
  let handler: ErrorHandler

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataUpload]
    })
    .compileComponents()
    .catch(err => handler.handleError(err))
    .then(() => logger.error('Could not compile components'))
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DataUpload)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
