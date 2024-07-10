import { TestBed } from '@angular/core/testing';

import { FilesResolver } from './files.resolver';

describe('FilesResolver', () => {
  let resolver: FilesResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(FilesResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
