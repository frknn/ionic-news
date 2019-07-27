import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RateusmodalPage } from './rateusmodal.page';

describe('RateusmodalPage', () => {
  let component: RateusmodalPage;
  let fixture: ComponentFixture<RateusmodalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RateusmodalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RateusmodalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
