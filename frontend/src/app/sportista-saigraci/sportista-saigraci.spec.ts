import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SportistaSaigraci } from './sportista-saigraci';

describe('SportistaSaigraci', () => {
  let component: SportistaSaigraci;
  let fixture: ComponentFixture<SportistaSaigraci>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SportistaSaigraci]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SportistaSaigraci);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
