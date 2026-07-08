import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUpravljanjeObjektima } from './admin-upravljanje-objektima';

describe('AdminUpravljanjeObjektima', () => {
  let component: AdminUpravljanjeObjektima;
  let fixture: ComponentFixture<AdminUpravljanjeObjektima>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUpravljanjeObjektima]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUpravljanjeObjektima);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
