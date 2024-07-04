import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditEmploymentTypeComponent } from './add-edit-employment-type.component';

describe('AddEditEmploymentTypeComponent', () => {
  let component: AddEditEmploymentTypeComponent;
  let fixture: ComponentFixture<AddEditEmploymentTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditEmploymentTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditEmploymentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
