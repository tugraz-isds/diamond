import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyClosedComponent } from './study-closed.component';

describe('StudyClosedComponent', () => {
  let component: StudyClosedComponent;
  let fixture: ComponentFixture<StudyClosedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudyClosedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudyClosedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
