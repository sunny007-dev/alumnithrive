import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareStartupIdeasComponent } from './share-startup-ideas.component';

describe('ShareStartupIdeasComponent', () => {
  let component: ShareStartupIdeasComponent;
  let fixture: ComponentFixture<ShareStartupIdeasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareStartupIdeasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareStartupIdeasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
