import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipanteForm } from './participante-form';

describe('ParticipanteForm', () => {
  let component: ParticipanteForm;
  let fixture: ComponentFixture<ParticipanteForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipanteForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipanteForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
