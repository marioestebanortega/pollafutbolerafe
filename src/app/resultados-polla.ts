import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultadosService, ResultadoPolla } from './services/resultados.service';
import { RouterModule, Router } from '@angular/router';

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

  constructor(private resultadosService: ResultadosService, private router: Router) {}

  ngOnInit() {
    this.cargarResultados();
    this.retryInterval = setInterval(() => this.cargarResultados(), 30000);
  }

  ngOnDestroy() {
    if (this.retryInterval) {
      clearInterval(this.retryInterval);
    }
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
}
