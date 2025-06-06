import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenMarcadores } from './resumen-marcadores';

describe('ResumenMarcadores', () => {
  let component: ResumenMarcadores;
  let fixture: ComponentFixture<ResumenMarcadores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumenMarcadores]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumenMarcadores);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
