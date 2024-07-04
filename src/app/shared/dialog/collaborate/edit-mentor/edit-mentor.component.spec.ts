import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMentorComponent } from './edit-mentor.component';

describe('EditMentorComponent', () => {
  let component: EditMentorComponent;
  let fixture: ComponentFixture<EditMentorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditMentorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMentorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
