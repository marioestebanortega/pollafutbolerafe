import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ParticipanteResponse {
  exists: boolean;
  name?: string;
  winner?: string;
  first_half_score?: string;
  second_half_score?: string;
}

export interface ParticipanteData {
  phone: string;
  name: string;
  winner: string;
  first_half_score: string;
  second_half_score: string;
  id_polla: string;
}

@Injectable({
  providedIn: 'root'
})
export class ParticipanteService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  validarCelular(phone: string, id_polla: string): Observable<ParticipanteResponse> {
    const params = new HttpParams()
      .set('phone', phone)
      .set('id_polla', id_polla);
    return this.http.get<ParticipanteResponse>(`${this.apiUrl}/buscar-participante`, { params });
  }

  crearParticipante(data: ParticipanteData): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear-participante`, data);
  }

  actualizarParticipante(data: ParticipanteData): Observable<any> {
    return this.http.put(`${this.apiUrl}/actualizar-participante`, data);
  }

  getParticipantes(): Observable<{ name: string; phone: string; winner: string; first_half_score: string; second_half_score: string }[]> {
    return this.http.get<{ name: string; phone: string; winner: string; first_half_score: string; second_half_score: string }[]>(`${this.apiUrl}/participantes`);
  }
} 