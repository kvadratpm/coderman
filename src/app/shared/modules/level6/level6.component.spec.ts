import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Level6Component } from './level6.component';

describe('Level6Component', () => {
  let component: Level6Component;
  let fixture: ComponentFixture<Level6Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Level6Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Level6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
