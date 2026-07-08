import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SportistaStatistika } from './sportista-statistika';

describe('SportistaStatistika', () => {
  let component: SportistaStatistika;
  let fixture: ComponentFixture<SportistaStatistika>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SportistaStatistika]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SportistaStatistika);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
