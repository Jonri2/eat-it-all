import { TestBed } from '@angular/core/testing';

import { SharedTreeDataService } from './shared-tree-data.service';

describe('SharedTreeDataService', () => {
  let service: SharedTreeDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedTreeDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
