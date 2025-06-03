import { Routes } from '@angular/router';
import { ResultadosPollaComponent } from './resultados-polla';
import { ParticipanteFormComponent } from './participante-form/participante-form.component';

export const routes: Routes = [
  { path: '', component: ResultadosPollaComponent },
  { path: 'participante', component: ParticipanteFormComponent }
];
