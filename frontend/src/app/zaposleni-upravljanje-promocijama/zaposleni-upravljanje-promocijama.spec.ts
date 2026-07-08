import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZaposleniUpravljanjePromocijama } from './zaposleni-upravljanje-promocijama';

describe('ZaposleniUpravljanjePromocijama', () => {
  let component: ZaposleniUpravljanjePromocijama;
  let fixture: ComponentFixture<ZaposleniUpravljanjePromocijama>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZaposleniUpravljanjePromocijama]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZaposleniUpravljanjePromocijama);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
