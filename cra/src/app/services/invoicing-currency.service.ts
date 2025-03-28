import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InvoicingCurrency } from '../models/interfaces/invoicing-currency.interface';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InvoicingCurrencyService {
  private apiUrl = 'http://localhost:8081/api/v1/invoicing-currencies';

  constructor(private http: HttpClient) {}

  

getAll(): Observable<InvoicingCurrency[]> {
  return this.http
    .get<{ content: InvoicingCurrency[] }>(this.apiUrl)
    .pipe(map(response => response.content));
}

  create(currency: Partial<InvoicingCurrency>): Observable<InvoicingCurrency> {
    return this.http.post<InvoicingCurrency>(this.apiUrl, currency);
  }

  update(id: string, currency: Partial<InvoicingCurrency>): Observable<InvoicingCurrency> {
    return this.http.put<InvoicingCurrency>(`${this.apiUrl}/${id}`, currency);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
