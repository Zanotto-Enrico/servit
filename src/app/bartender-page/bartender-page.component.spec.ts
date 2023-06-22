import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BartenderPageComponent } from './bartender-page.component';

describe('BartenderPageComponent', () => {
  let component: BartenderPageComponent;
  let fixture: ComponentFixture<BartenderPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BartenderPageComponent]
    });
    fixture = TestBed.createComponent(BartenderPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
