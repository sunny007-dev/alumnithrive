import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditExpertiseComponent } from './add-edit-expertise.component';

describe('AddEditExpertiseComponent', () => {
  let component: AddEditExpertiseComponent;
  let fixture: ComponentFixture<AddEditExpertiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditExpertiseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditExpertiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
