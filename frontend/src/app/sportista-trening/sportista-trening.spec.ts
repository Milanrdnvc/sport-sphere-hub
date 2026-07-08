import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SportistaTrening } from './sportista-trening';

describe('SportistaTrening', () => {
  let component: SportistaTrening;
  let fixture: ComponentFixture<SportistaTrening>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SportistaTrening]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SportistaTrening);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
