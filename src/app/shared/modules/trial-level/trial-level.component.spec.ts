import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialLevelComponent } from './trial-level.component';

describe('TrialLevelComponent', () => {
  let component: TrialLevelComponent;
  let fixture: ComponentFixture<TrialLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrialLevelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrialLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
