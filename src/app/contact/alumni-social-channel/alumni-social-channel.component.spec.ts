import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumniSocialChannelComponent } from './alumni-social-channel.component';

describe('AlumniSocialChannelComponent', () => {
  let component: AlumniSocialChannelComponent;
  let fixture: ComponentFixture<AlumniSocialChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlumniSocialChannelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlumniSocialChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
