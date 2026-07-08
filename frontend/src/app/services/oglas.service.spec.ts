import { TestBed } from '@angular/core/testing';

import { OglasService } from './oglas.service';

describe('OglasService', () => {
  let service: OglasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OglasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
