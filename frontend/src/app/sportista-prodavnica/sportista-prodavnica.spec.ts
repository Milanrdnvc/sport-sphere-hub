import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SportistaProdavnica } from './sportista-prodavnica';

describe('SportistaProdavnica', () => {
  let component: SportistaProdavnica;
  let fixture: ComponentFixture<SportistaProdavnica>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SportistaProdavnica]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SportistaProdavnica);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
