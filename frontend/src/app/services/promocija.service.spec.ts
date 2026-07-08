import { TestBed } from '@angular/core/testing';

import { PromocijaService } from './promocija.service';

describe('PromocijaService', () => {
  let service: PromocijaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PromocijaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
