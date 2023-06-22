import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveWaiterComponent } from './remove-waiter.component';

describe('RemoveWaiterComponent', () => {
  let component: RemoveWaiterComponent;
  let fixture: ComponentFixture<RemoveWaiterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RemoveWaiterComponent]
    });
    fixture = TestBed.createComponent(RemoveWaiterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
