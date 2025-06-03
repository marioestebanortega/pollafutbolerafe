import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ResultadoPolla {
  equipos: {
    league: { logo: string; name: string; round: string };
    home: { logo: string; name: string };
    away: { logo: string; name: string };
  };
  estadio: { nombre: string; ciudad: string };
  status: { estado: string; minutos: number; tiempo_extra?: number };
  resultado_real: { final_score: string };
  resultados: Array<{
    posicion: number;
    name: string;
    score: number;
    predictions: {
      winner: string;
      final_score: string;
      first_half: string;
      second_half: string;
    };
  }>;
}

@Injectable({ providedIn: 'root' })
export class ResultadosService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}
  getResultados(): Observable<ResultadoPolla> {
    return this.http.get<ResultadoPolla>(`${this.apiUrl}/resultados`);
  }
} 