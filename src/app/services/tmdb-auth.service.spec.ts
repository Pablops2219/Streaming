import { TestBed } from '@angular/core/testing';

import { TmdbAuthService } from '../services/tmdb-auth.service';

describe('TmdbAuthService', () => {
  let service: TmdbAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TmdbAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
