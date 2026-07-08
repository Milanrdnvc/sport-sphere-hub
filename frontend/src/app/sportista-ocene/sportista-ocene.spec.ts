import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SportistaOcene } from './sportista-ocene';

describe('SportistaOcene', () => {
  let component: SportistaOcene;
  let fixture: ComponentFixture<SportistaOcene>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SportistaOcene]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SportistaOcene);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
