import { TestBed } from '@angular/core/testing';

import { StatistikaService } from './statistika.service';

describe('StatistikaService', () => {
  let service: StatistikaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatistikaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
