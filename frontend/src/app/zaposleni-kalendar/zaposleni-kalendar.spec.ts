import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZaposleniKalendar } from './zaposleni-kalendar';

describe('ZaposleniKalendar', () => {
  let component: ZaposleniKalendar;
  let fixture: ComponentFixture<ZaposleniKalendar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZaposleniKalendar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZaposleniKalendar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
