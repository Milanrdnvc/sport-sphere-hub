import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUpravljanjeTrenera } from './admin-upravljanje-trenera';

describe('AdminUpravljanjeTrenera', () => {
  let component: AdminUpravljanjeTrenera;
  let fixture: ComponentFixture<AdminUpravljanjeTrenera>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUpravljanjeTrenera]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUpravljanjeTrenera);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
