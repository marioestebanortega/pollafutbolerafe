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
  id_polla: string;
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
export class PartidoService {
  private apiUrl = 'http://127.0.0.1:10000';

  constructor(private http: HttpClient) { }

  getMatchInfo(): Observable<MatchInfo> {
    return this.http.get<MatchInfo>(`${this.apiUrl}/partido-info`);
  }
} 