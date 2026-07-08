import { TestBed } from '@angular/core/testing';

import { TrenerService } from './trener.service';

describe('TrenerService', () => {
  let service: TrenerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrenerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
