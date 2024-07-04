import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClubsComponent } from './add-clubs.component';

describe('AddClubsComponent', () => {
  let component: AddClubsComponent;
  let fixture: ComponentFixture<AddClubsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddClubsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddClubsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
