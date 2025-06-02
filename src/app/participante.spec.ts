import { TestBed } from '@angular/core/testing';

import { Participante } from './participante';

describe('Participante', () => {
  let service: Participante;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Participante);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
