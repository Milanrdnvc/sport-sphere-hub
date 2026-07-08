import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetLozinkeLink } from './reset-lozinke-link';

describe('ResetLozinkeLink', () => {
  let component: ResetLozinkeLink;
  let fixture: ComponentFixture<ResetLozinkeLink>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetLozinkeLink]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetLozinkeLink);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
