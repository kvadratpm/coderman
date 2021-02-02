import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Level8Component } from './level8.component';

describe('Level8Component', () => {
  let component: Level8Component;
  let fixture: ComponentFixture<Level8Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Level8Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Level8Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
