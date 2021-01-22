import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Phaser1Component } from './phaser1.component';

describe('Phaser1Component', () => {
  let component: Phaser1Component;
  let fixture: ComponentFixture<Phaser1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Phaser1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Phaser1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
