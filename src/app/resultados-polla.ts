import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultadosService, ResultadoPolla } from './services/resultados.service';
import { RouterModule } from '@angular/router';

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

  constructor(private resultadosService: ResultadosService) {}

  ngOnInit() {
    this.cargarResultados();
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
        if (this.retryInterval) {
          clearInterval(this.retryInterval);
          this.retryInterval = null;
        }
      },
      error: (err) => {
        if (err.status === 0) {
          this.error = 'Estamos intentando conectarnos, por favor espera un momento...';
          if (!this.retryInterval) {
            this.retryInterval = setInterval(() => this.cargarResultados(), 10000);
          }
        } else {
          this.error = err?.error?.error || err?.message || 'Error al obtener los resultados';
        }
        this.loading = false;
      }
    });
  }

  irARegistro() {
    window.location.href = '/participante';
  }
}
