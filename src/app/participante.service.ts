import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParticipanteService {
  apiUrl = 'http://localhost:10000'; // Cambia por tu URL real

  constructor(private http: HttpClient) {}

  buscarParticipante(id_polla: number, phone: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/buscar-participante?id_polla=${id_polla}&phone=${phone}`);
  }

  registrarParticipante(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear-participante`, data);
  }

  actualizarParticipante(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/actualizar-participante`, data);
  }
} 