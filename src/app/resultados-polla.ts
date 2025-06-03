import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultadosService, ResultadoPolla } from './services/resultados.service';
import { RouterModule, Router } from '@angular/router';
import { PartidoService, MatchInfo } from './services/partido.service';

@Component({
  selector: 'app-resultados-polla',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './resultados-polla.html',
  styleUrls: ['./resultados-polla.scss']
})
export class ResultadosPollaComponent implements OnInit, OnDestroy {
  resultados: ResultadoPolla | null = null;
  loading = true;
  error: string = '';
  private retryInterval: any = null;
  matchInfo: MatchInfo | null = null;
  waitingForResults = false;

  constructor(
    private resultadosService: ResultadosService,
    private partidoService: PartidoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loading = true;
    this.partidoService.getMatchInfo().subscribe({
      next: (info) => {
        this.matchInfo = info;
        const matchDate = new Date(info.fixture.date);
        const now = new Date();
        const diffMs = matchDate.getTime() - now.getTime();
        const diffMin = diffMs / 60000;
        if (diffMin > 5) {
          this.waitingForResults = true;
          this.loading = false;
          // Calcular cuánto falta para los 5 minutos antes
          setTimeout(() => this.startPollingResultados(), (diffMs - 5 * 60000));
        } else {
          this.startPollingResultados();
        }
      },
      error: (err) => {
        this.error = 'No se pudo obtener la información del partido.';
        this.loading = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.retryInterval) {
      clearInterval(this.retryInterval);
    }
  }

  startPollingResultados() {
    this.waitingForResults = false;
    this.cargarResultados();
    this.retryInterval = setInterval(() => this.cargarResultados(), 30000);
  }

  cargarResultados() {
    this.loading = true;
    this.error = '';
    this.resultadosService.getResultados().subscribe({
      next: (data) => {
        this.resultados = data;
        this.loading = false;
        // Logger para depuración de predicciones
        if (this.resultados && this.resultados.resultados) {
          console.log('Resultados recibidos:', this.resultados.resultados);
          this.resultados.resultados.forEach((r, i) => {
            console.log(`Fila ${i}: predictions.winner =`, r.predictions.winner);
          });
        }
        // Detener polling si el partido terminó
        if (this.resultados?.status?.estado === 'Match Finished' && this.retryInterval) {
          clearInterval(this.retryInterval);
          this.retryInterval = null;
        }
      },
      error: (err) => {
        if (err.status === 0) {
          this.error = 'Estamos intentando conectarnos, por favor espera un momento...';
        } else {
          this.error = err?.error?.error || err?.message || 'Error al obtener los resultados';
        }
        this.loading = false;
      }
    });
  }

  irARegistro() {
    this.router.navigate(['/participante']);
  }

  showHomeLogo(r: any): boolean {
    return !!(r.predictions.winner && this.matchInfo && this.matchInfo.teams && this.matchInfo.teams.home && r.predictions.winner.toLowerCase() === this.matchInfo.teams.home.name.toLowerCase());
  }

  getHomeLogo(): string | undefined {
    return this.matchInfo && this.matchInfo.teams && this.matchInfo.teams.home ? this.matchInfo.teams.home.logo : undefined;
  }

  showAwayLogo(r: any): boolean {
    return !!(r.predictions.winner && this.matchInfo && this.matchInfo.teams && this.matchInfo.teams.away && r.predictions.winner.toLowerCase() === this.matchInfo.teams.away.name.toLowerCase());
  }

  getAwayLogo(): string | undefined {
    return this.matchInfo && this.matchInfo.teams && this.matchInfo.teams.away ? this.matchInfo.teams.away.logo : undefined;
  }
}
