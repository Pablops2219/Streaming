import { TestBed } from '@angular/core/testing';

import { TheMovieDBService } from '../services/the-movie-db.service';

describe('TheMovieDBService', () => {
  let service: TheMovieDBService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TheMovieDBService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
