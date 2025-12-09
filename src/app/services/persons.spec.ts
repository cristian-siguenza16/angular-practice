import { TestBed } from '@angular/core/testing';

import { Persons } from './persons';

describe('Persons', () => {
  let service: Persons;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Persons);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
