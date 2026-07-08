import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZaposleniRezervacije } from './zaposleni-rezervacije';

describe('ZaposleniRezervacije', () => {
  let component: ZaposleniRezervacije;
  let fixture: ComponentFixture<ZaposleniRezervacije>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZaposleniRezervacije]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZaposleniRezervacije);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
