import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendingPage } from './trending.page';

describe('TrendingPage', () => {
  let component: TrendingPage;
  let fixture: ComponentFixture<TrendingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrendingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrendingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
