import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {DataUpload} from './data-upload.component'

describe('DataUpload', () => {
    let component: DataUpload;
    let fixture: ComponentFixture<DataUpload>

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ DataUpload ]
        })
        .compileComponents()
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(DataUpload)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy();
    })
})