import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUpravljanjeKorisnicima } from './admin-upravljanje-korisnicima';

describe('AdminUpravljanjeKorisnicima', () => {
  let component: AdminUpravljanjeKorisnicima;
  let fixture: ComponentFixture<AdminUpravljanjeKorisnicima>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUpravljanjeKorisnicima]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUpravljanjeKorisnicima);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
