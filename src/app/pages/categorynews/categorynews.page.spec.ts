import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorynewsPage } from './categorynews.page';

describe('CategorynewsPage', () => {
  let component: CategorynewsPage;
  let fixture: ComponentFixture<CategorynewsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategorynewsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorynewsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
