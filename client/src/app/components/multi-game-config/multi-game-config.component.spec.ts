import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiGameConfigComponent } from './multi-game-config.component';

describe('MultiGameConfigComponent', () => {
  let component: MultiGameConfigComponent;
  let fixture: ComponentFixture<MultiGameConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiGameConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiGameConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
