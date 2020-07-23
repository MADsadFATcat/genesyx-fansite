import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DressingRoomComponent } from './dressing-room.component';

describe('DressingRoomComponent', () => {
  let component: DressingRoomComponent;
  let fixture: ComponentFixture<DressingRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DressingRoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DressingRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
