import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewOrderPageComponent } from './new-order-page.component';

describe('NewOrderPageComponent', () => {
  let component: NewOrderPageComponent;
  let fixture: ComponentFixture<NewOrderPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewOrderPageComponent]
    });
    fixture = TestBed.createComponent(NewOrderPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
