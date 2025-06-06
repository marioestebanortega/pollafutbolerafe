import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resumen-marcadores',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resumen-marcadores.html',
  styleUrls: ['./resumen-marcadores.scss']
})
export class ResumenMarcadoresComponent implements OnInit {
  @Input() participantes: { name: string; winner: string; first_half_score: string; second_half_score: string }[] = [];
  @Input() valorPorParticipante: number = 0;

  resumenMarcadoresFinal: { marcador: string; frecuencia: number; participantes: string[] }[] = [];
  resumenMarcadoresPrimerTiempo: { marcador: string; frecuencia: number; participantes: string[] }[] = [];
  resumenMarcadoresSegundoTiempo: { marcador: string; frecuencia: number; participantes: string[] }[] = [];
  ganadorMasFrecuente: { nombre: string; frecuencia: number } | null = null;
  valorTotalPremio: number = 0;
  resumenCombinaciones: { combinacion: string; frecuencia: number; participantes: string[] }[] = [];

  ngOnInit() {
    this.calcularResumen();
  }

  ngOnChanges() {
    this.calcularResumen();
  }

  calcularResumen() {
    // Marcador final (suma de ambos tiempos)
    const marcadorFinalMap = new Map<string, { frecuencia: number; participantes: string[] }>();
    // Marcador primer tiempo
    const marcadorPTMap = new Map<string, { frecuencia: number; participantes: string[] }>();
    // Marcador segundo tiempo
    const marcadorSTMap = new Map<string, { frecuencia: number; participantes: string[] }>();
    // Ganador
    const ganadorMap = new Map<string, number>();
    // Combinación exacta primer tiempo + segundo tiempo
    const combinacionMap = new Map<string, { frecuencia: number; participantes: string[] }>();

    for (const p of this.participantes) {
      // Marcador primer tiempo
      if (!marcadorPTMap.has(p.first_half_score)) {
        marcadorPTMap.set(p.first_half_score, { frecuencia: 0, participantes: [] });
      }
      marcadorPTMap.get(p.first_half_score)!.frecuencia++;
      marcadorPTMap.get(p.first_half_score)!.participantes.push(p.name);

      // Marcador segundo tiempo
      if (!marcadorSTMap.has(p.second_half_score)) {
        marcadorSTMap.set(p.second_half_score, { frecuencia: 0, participantes: [] });
      }
      marcadorSTMap.get(p.second_half_score)!.frecuencia++;
      marcadorSTMap.get(p.second_half_score)!.participantes.push(p.name);

      // Marcador final
      const marcadorFinal = this.calcularMarcadorCompleto(p.first_half_score, p.second_half_score);
      if (!marcadorFinalMap.has(marcadorFinal)) {
        marcadorFinalMap.set(marcadorFinal, { frecuencia: 0, participantes: [] });
      }
      marcadorFinalMap.get(marcadorFinal)!.frecuencia++;
      marcadorFinalMap.get(marcadorFinal)!.participantes.push(p.name);

      // Ganador
      if (!ganadorMap.has(p.winner)) {
        ganadorMap.set(p.winner, 0);
      }
      ganadorMap.set(p.winner, ganadorMap.get(p.winner)! + 1);

      // Combinación exacta primer tiempo + segundo tiempo
      const combinacion = `${p.first_half_score} | ${p.second_half_score}`;
      if (!combinacionMap.has(combinacion)) {
        combinacionMap.set(combinacion, { frecuencia: 0, participantes: [] });
      }
      combinacionMap.get(combinacion)!.frecuencia++;
      combinacionMap.get(combinacion)!.participantes.push(p.name);
    }

    // Convertir a arrays y ordenar por frecuencia descendente
    this.resumenMarcadoresPrimerTiempo = Array.from(marcadorPTMap.entries()).map(([marcador, data]) => ({
      marcador,
      frecuencia: data.frecuencia,
      participantes: data.participantes
    })).sort((a, b) => b.frecuencia - a.frecuencia);

    this.resumenMarcadoresSegundoTiempo = Array.from(marcadorSTMap.entries()).map(([marcador, data]) => ({
      marcador,
      frecuencia: data.frecuencia,
      participantes: data.participantes
    })).sort((a, b) => b.frecuencia - a.frecuencia);

    this.resumenMarcadoresFinal = Array.from(marcadorFinalMap.entries()).map(([marcador, data]) => ({
      marcador,
      frecuencia: data.frecuencia,
      participantes: data.participantes
    })).sort((a, b) => b.frecuencia - a.frecuencia);

    // Ganador más frecuente
    let maxGanador = '';
    let maxFrecuencia = 0;
    ganadorMap.forEach((freq, nombre) => {
      if (freq > maxFrecuencia) {
        maxFrecuencia = freq;
        maxGanador = nombre;
      }
    });
    this.ganadorMasFrecuente = maxGanador ? { nombre: maxGanador, frecuencia: maxFrecuencia } : null;

    // Premio acumulado: total de participantes * valorPorParticipante
    this.valorTotalPremio = this.participantes.length * this.valorPorParticipante;

    this.resumenCombinaciones = Array.from(combinacionMap.entries()).map(([combinacion, data]) => ({
      combinacion,
      frecuencia: data.frecuencia,
      participantes: data.participantes
    })).sort((a, b) => b.frecuencia - a.frecuencia);
  }

  calcularMarcadorCompleto(first: string, second: string): string {
    if (!/^\d+-\d+$/.test(first) || !/^\d+-\d+$/.test(second)) return '';
    const [fhL, fhV] = first.split('-').map(Number);
    const [shL, shV] = second.split('-').map(Number);
    return `${fhL + shL}-${fhV + shV}`;
  }

  formatearMoneda(valor: number): string {
    return valor.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
  }

  get combinacionesFrecuentes() {
    return this.resumenCombinaciones.filter(c => c.frecuencia > 1);
  }
}
