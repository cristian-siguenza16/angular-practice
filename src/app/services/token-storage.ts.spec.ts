import { TestBed } from '@angular/core/testing';

import { TokenStorageTs } from './token-storage.ts';

describe('TokenStorageTs', () => {
  let service: TokenStorageTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenStorageTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
