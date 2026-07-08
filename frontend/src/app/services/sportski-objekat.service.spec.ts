import { TestBed } from '@angular/core/testing';

import { SportskiObjekatService } from './sportski-objekat.service';

describe('SportskiObjekatService', () => {
  let service: SportskiObjekatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SportskiObjekatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
