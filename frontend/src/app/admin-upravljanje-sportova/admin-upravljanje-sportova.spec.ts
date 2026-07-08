import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUpravljanjeSportova } from './admin-upravljanje-sportova';

describe('AdminUpravljanjeSportova', () => {
  let component: AdminUpravljanjeSportova;
  let fixture: ComponentFixture<AdminUpravljanjeSportova>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUpravljanjeSportova]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUpravljanjeSportova);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
