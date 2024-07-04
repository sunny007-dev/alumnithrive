import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditQueriesComponent } from './add-edit-queries.component';

describe('AddEditQueriesComponent', () => {
  let component: AddEditQueriesComponent;
  let fixture: ComponentFixture<AddEditQueriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditQueriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditQueriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
