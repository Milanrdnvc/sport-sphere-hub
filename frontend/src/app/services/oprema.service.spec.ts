import { TestBed } from '@angular/core/testing';

import { OpremaService } from './oprema.service';

describe('OpremaService', () => {
  let service: OpremaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpremaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
