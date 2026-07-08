import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Guest } from './guest';

describe('Guest', () => {
  let component: Guest;
  let fixture: ComponentFixture<Guest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Guest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Guest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
