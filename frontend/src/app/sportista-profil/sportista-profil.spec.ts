import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SportistaProfil } from './sportista-profil';

describe('SportistaProfil', () => {
  let component: SportistaProfil;
  let fixture: ComponentFixture<SportistaProfil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SportistaProfil]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SportistaProfil);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
