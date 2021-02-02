import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Level10Component } from './level10.component';

describe('Level10Component', () => {
  let component: Level10Component;
  let fixture: ComponentFixture<Level10Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Level10Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Level10Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
