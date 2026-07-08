import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SportistaRezervacija } from './sportista-rezervacija';

describe('SportistaRezervacija', () => {
  let component: SportistaRezervacija;
  let fixture: ComponentFixture<SportistaRezervacija>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SportistaRezervacija]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SportistaRezervacija);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
