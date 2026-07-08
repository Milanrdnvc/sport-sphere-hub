import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZaposleniIzvestaji } from './zaposleni-izvestaji';

describe('ZaposleniIzvestaji', () => {
  let component: ZaposleniIzvestaji;
  let fixture: ComponentFixture<ZaposleniIzvestaji>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZaposleniIzvestaji]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZaposleniIzvestaji);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
