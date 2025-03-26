import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceContract } from '../models/interfaces/service-contract.interface';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServiceContractService {
  private apiUrl = 'http://localhost:8081/api/v1/service-contracts';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ServiceContract[]> {
    return this.http.get<{ content: ServiceContract[] }>(this.apiUrl).pipe(
      map(response => response.content)
    );
  }

  getById(id: string): Observable<ServiceContract> {
    return this.http.get<ServiceContract>(`${this.apiUrl}/${id}`);
  }

  create(contract: Partial<ServiceContract>): Observable<ServiceContract> {
    return this.http.post<ServiceContract>(this.apiUrl, contract);
  }

  update(id: string, contract: Partial<ServiceContract>): Observable<ServiceContract> {
    return this.http.put<ServiceContract>(`${this.apiUrl}/${id}`, contract);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
