import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminZahteviZaRegistraciju } from './admin-zahtevi-za-registraciju';

describe('AdminZahteviZaRegistraciju', () => {
  let component: AdminZahteviZaRegistraciju;
  let fixture: ComponentFixture<AdminZahteviZaRegistraciju>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminZahteviZaRegistraciju]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminZahteviZaRegistraciju);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
