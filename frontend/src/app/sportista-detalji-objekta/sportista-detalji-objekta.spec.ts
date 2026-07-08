import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SportistaDetaljiObjekta } from './sportista-detalji-objekta';

describe('SportistaDetaljiObjekta', () => {
  let component: SportistaDetaljiObjekta;
  let fixture: ComponentFixture<SportistaDetaljiObjekta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SportistaDetaljiObjekta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SportistaDetaljiObjekta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
