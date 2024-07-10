import { TestBed } from '@angular/core/testing';

import { FileDetailsResolver } from './file-details.resolver';

describe('FileDetailsResolver', () => {
  let resolver: FileDetailsResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(FileDetailsResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
