import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiplayerJoinFormComponent } from './multiplayer-join-form.component';

describe('MultiplayerJoinFormComponent', () => {
  let component: MultiplayerJoinFormComponent;
  let fixture: ComponentFixture<MultiplayerJoinFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiplayerJoinFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiplayerJoinFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
