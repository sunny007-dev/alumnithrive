import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDonationComponent } from './view-donation.component';

describe('ViewDonationComponent', () => {
  let component: ViewDonationComponent;
  let fixture: ComponentFixture<ViewDonationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDonationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDonationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
