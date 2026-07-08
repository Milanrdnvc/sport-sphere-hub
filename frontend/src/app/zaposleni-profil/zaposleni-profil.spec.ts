import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZaposleniProfil } from './zaposleni-profil';

describe('ZaposleniProfil', () => {
  let component: ZaposleniProfil;
  let fixture: ComponentFixture<ZaposleniProfil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZaposleniProfil]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZaposleniProfil);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
