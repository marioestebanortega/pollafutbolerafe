import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ParticipanteService, ParticipanteResponse } from '../services/participante.service';
import { PartidoService, MatchInfo } from '../services/partido.service';

@Component({
  selector: 'app-participante-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './participante-form.component.html',
  styleUrls: ['./participante-form.component.scss']
})
export class ParticipanteFormComponent implements OnInit {
  form: FormGroup;
  showForm = false;
  isEditing = false;
  phoneDisabled = false;
  mensaje: string = '';
  mensajeError: string = '';
  loading = false;
  matchLoading = true;
  matchInfo: MatchInfo | null = null;
  participantes: { name: string; phone: string; winner: string; first_half_score: string; second_half_score: string }[] = [];
  participantesFiltrados: { name: string; phone: string; winner: string; first_half_score: string; second_half_score: string }[] = [];
  filtro: string = '';
  mostrarTabla: boolean = true;

  // Custom validator for winner coherence as a class property to access this.matchInfo
  winnerCoherenceValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const form = control as FormGroup;
    const winner = form.get('winner')?.value;
    const first = form.get('first_half_score')?.value;
    const second = form.get('second_half_score')?.value;
    if (!winner || !first || !second) return null;
    if (!/^\d+-\d+$/.test(first) || !/^\d+-\d+$/.test(second)) return null;
    const [fhL, fhV] = first.split('-').map(Number);
    const [shL, shV] = second.split('-').map(Number);
    const totalLocal = fhL + shL;
    const totalVisit = fhV + shV;
    if (winner === 'Empate' && totalLocal !== totalVisit) {
      return { winnerCoherence: 'Para empate, el marcador final debe ser igual.' };
    }
    if (this.matchInfo) {
      if (winner === this.matchInfo.teams.home.name && totalLocal <= totalVisit) {
        return { winnerCoherence: `Para que gane ${this.matchInfo.teams.home.name}, el marcador final debe ser mayor para ${this.matchInfo.teams.home.name}.` };
      }
      if (winner === this.matchInfo.teams.away.name && totalVisit <= totalLocal) {
        return { winnerCoherence: `Para que gane ${this.matchInfo.teams.away.name}, el marcador final debe ser mayor para ${this.matchInfo.teams.away.name}.` };
      }
    }
    return null;
  };

  constructor(
    private fb: FormBuilder,
    private participanteService: ParticipanteService,
    private partidoService: PartidoService
  ) {
    this.form = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      name: ['', Validators.required],
      winner: ['', Validators.required],
      first_half_score: ['', [Validators.required, scoreFormatValidator()]],
      second_half_score: ['', [Validators.required, scoreFormatValidator()]]
    }, { validators: this.winnerCoherenceValidator });
  }

  ngOnInit() {
    this.loadMatchInfo();
    this.loadParticipantes();
  }

  loadMatchInfo() {
    this.matchLoading = true;
    this.partidoService.getMatchInfo().subscribe({
      next: (data) => {
        this.matchInfo = data;
        this.matchLoading = false;
      },
      error: (error: Error) => {
        console.error('Error loading match info:', error);
        this.mensajeError = 'Error al cargar la información del partido';
        this.matchLoading = false;
      }
    });
  }

  loadParticipantes() {
    this.participanteService.getParticipantes().subscribe({
      next: (data) => {
        this.participantes = data;
        this.filtrarParticipantes();
      },
      error: (error: Error) => {
        console.error('Error al cargar participantes:', error);
      }
    });
  }

  filtrarParticipantes() {
    const filtroLower = this.filtro.toLowerCase();
    this.participantesFiltrados = this.participantes.filter(p =>
      p.name.toLowerCase().includes(filtroLower) ||
      p.phone.includes(this.filtro)
    );
  }

  onBuscarChange(valor: any) {
    this.filtro = typeof valor === 'string' ? valor : (valor?.target?.value || '');
    this.filtrarParticipantes();
  }

  seleccionarParticipante(participante: { name: string; phone: string }) {
    this.mostrarTabla = false;
    this.form.reset();
    this.form.get('phone')?.setValue(participante.phone);
    this.phoneDisabled = true;
    this.validarCelular();
  }

  nuevoRegistro() {
    this.mostrarTabla = false;
    this.form.reset();
    this.phoneDisabled = false;
    this.showForm = false;
    this.isEditing = false;
  }

  validarCelular() {
    if (this.form.get('phone')?.valid && this.matchInfo) {
      this.loading = true;
      this.mensaje = '';
      this.mensajeError = '';
      const phone = this.form.get('phone')?.value;
      const id_polla = this.matchInfo.id_polla;

      console.log('[VALIDAR] Llamando a buscar-participante con:', { phone, id_polla });

      this.participanteService.validarCelular(phone, id_polla).subscribe({
        next: (response: ParticipanteResponse) => {
          console.log('[VALIDAR] Respuesta del backend:', response);
          this.loading = false;
          if (response && response.name) {
            console.log('[VALIDAR] Participante encontrado, actualizando formulario');
            this.mensaje = '¡Bienvenido! Registra tus datos para hacer parte de la Polla Futbolera.';
            this.isEditing = true;
            let winnerValue = response.winner;
            if (winnerValue === 'Local') {
              winnerValue = this.matchInfo?.teams?.home?.name;
            } else if (winnerValue === 'Visitante') {
              winnerValue = this.matchInfo?.teams?.away?.name;
            }
            this.form.patchValue({
              name: response.name,
              winner: winnerValue,
              first_half_score: response.first_half_score,
              second_half_score: response.second_half_score
            });
          } else {
            console.log('[VALIDAR] Participante NO encontrado');
            this.mensaje = 'Celular no registrado. Por favor, completa tus datos.';
            this.isEditing = false;
          }
          this.showForm = true;
          this.phoneDisabled = true;
        },
        error: (error: Error) => {
          console.error('[VALIDAR] Error al validar el celular:', error);
          this.loading = false;
          this.mensajeError = 'Error al validar el celular';
        }
      });
    }
  }

  onSubmit() {
    if (this.form.valid && this.matchInfo) {
      this.loading = true;
      this.mensaje = '';
      this.mensajeError = '';

      const participanteData = {
        ...this.form.value,
        id_polla: this.matchInfo.id_polla
      };

      if (this.isEditing) {
        this.participanteService.actualizarParticipante(participanteData).subscribe({
          next: (response: any) => {
            this.loading = false;
            this.mensaje = 'Predicción actualizada exitosamente';
            this.form.reset();
            this.showForm = false;
            this.phoneDisabled = false;
            this.isEditing = false;
            this.mostrarTabla = true;
            this.loadParticipantes();
          },
          error: (error: any) => {
            this.loading = false;
            this.mensajeError = error?.error?.error || error?.error?.message || error?.message || 'Error al actualizar la predicción';
            console.error('Error:', error);
          }
        });
      } else {
        this.participanteService.crearParticipante(participanteData).subscribe({
          next: (response: any) => {
            this.loading = false;
            this.mensaje = 'Participante registrado exitosamente';
            this.form.reset();
            this.showForm = false;
            this.phoneDisabled = false;
            this.mostrarTabla = true;
            this.loadParticipantes();
          },
          error: (error: any) => {
            this.loading = false;
            this.mensajeError = error?.error?.error || error?.error?.message || error?.message || 'Error al registrar el participante';
            console.error('Error:', error);
          }
        });
      }
    }
  }

  getMatchTime(): string {
    if (!this.matchInfo) return '';
    const date = new Date(this.matchInfo.fixture.date);
    return date.toLocaleString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

// Custom validator for score format (e.g., 1-0)
function scoreFormatValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;
    return /^\d+-\d+$/.test(value) ? null : { scoreFormat: true };
  };
} 