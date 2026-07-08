import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZaposleniUpravljanjeObjektima } from './zaposleni-upravljanje-objektima';

describe('ZaposleniUpravljanjeObjektima', () => {
  let component: ZaposleniUpravljanjeObjektima;
  let fixture: ComponentFixture<ZaposleniUpravljanjeObjektima>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZaposleniUpravljanjeObjektima]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZaposleniUpravljanjeObjektima);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
