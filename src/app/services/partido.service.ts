import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getMatchInfo(): Observable<MatchInfo> {
    return this.http.get<MatchInfo>(`${this.apiUrl}/partido-info`);
  }
} 