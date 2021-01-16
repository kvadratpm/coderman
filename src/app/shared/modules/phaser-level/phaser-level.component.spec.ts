import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhaserLevelComponent } from './phaser-level.component';

describe('PhaserLevelComponent', () => {
  let component: PhaserLevelComponent;
  let fixture: ComponentFixture<PhaserLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhaserLevelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhaserLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
