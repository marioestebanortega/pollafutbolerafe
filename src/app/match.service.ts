import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MatchInfo {
  fixture: {
    date: string;
    id: number;
    periods: {
      first: number;
      second: number;
    };
    referee: string;
    status: {
      elapsed: number;
      extra: number;
      long: string;
      short: string;
    };
    timestamp: number;
    timezone: string;
    venue: {
      city: string;
      id: number;
      name: string;
    };
  };
  league: {
    country: string;
    flag: string;
    id: number;
    logo: string;
    name: string;
    round: string;
    season: number;
    standings: boolean;
  };
  match_id: number;
  teams: {
    away: {
      id: number;
      logo: string;
      name: string;
      winner: boolean | null;
    };
    home: {
      id: number;
      logo: string;
      name: string;
      winner: boolean | null;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private apiUrl = 'http://localhost:10000';

  constructor(private http: HttpClient) {}

  getMatchInfo(): Observable<MatchInfo> {
    return this.http.get<MatchInfo>(`${this.apiUrl}/partido-info`);
  }

  convertUTCToColombiaTime(utcDate: string): string {
    const date = new Date(utcDate);
    return date.toLocaleString('es-CO', {
      timeZone: 'America/Bogota',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }
} 