import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZaposleniUpravljanjeOpremom } from './zaposleni-upravljanje-opremom';

describe('ZaposleniUpravljanjeOpremom', () => {
  let component: ZaposleniUpravljanjeOpremom;
  let fixture: ComponentFixture<ZaposleniUpravljanjeOpremom>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZaposleniUpravljanjeOpremom]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZaposleniUpravljanjeOpremom);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
