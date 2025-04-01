// src/app/services/company.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Company } from '../models/interfaces/company.interface';

import { AppUser } from '../models/interfaces/user.interface';

import { InvoicingConditions } from '../models/interfaces/invoicing-conditions.interface';

import { PaymentTerm } from '../models/interfaces/payment-term.interface';

import { InvoicingCurrency } from '../models/interfaces/invoicing-currency.interface';

import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private apiUrl = 'http://localhost:8081/api/v1/companies';

  constructor(private http: HttpClient) {}

  /**
   * Get all companies (flattened content only)
   */
  getAll(): Observable<Company[]> {
    return this.http.get<{ content: Company[] }>(this.apiUrl).pipe(
      map(response => response.content || [])
    );
  }

  /**
   * Get a company by ID
   * @param id UUID of the company
   */
  getById(id: string): Observable<Company> {
    return this.http.get<Company>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new company
   * @param company Company object to create
   */
  create(company: Company): Observable<Company> {
    return this.http.post<Company>(this.apiUrl, company);
  }

  /**
   * Update a company by ID
   * @param id UUID of the company
   * @param company Updated company object
   */
  update(id: string, company: Company): Observable<Company> {
    return this.http.put<Company>(`${this.apiUrl}/${id}`, company);
  }

  /**
   * Delete a company by ID
   * @param id UUID of the company
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }



  getInvoicingConditions() {
    return this.http.get<InvoicingConditions[]>('http://localhost:8081/api/v1/invoicing-conditions');
  }
  
  getPaymentTerms() {
    return this.http.get<PaymentTerm[]>('http://localhost:8081/api/v1/payment-terms');
  }
  
  getInvoicingCurrencies() {
    return this.http.get<InvoicingCurrency[]>('http://localhost:8081/api/v1/invoicing-currencies');
  }
  
  getManagers() {
    return this.http.get<AppUser[]>('http://localhost:8081/api/v1/users/all'); // or `/users/managers` if you filter only managers
  }
  
}
