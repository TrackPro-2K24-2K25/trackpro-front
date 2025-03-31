import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BankAccount } from '../models/interfaces/bank-account.interface';
import { BankAccountRequest } from '../models/dto/bank-account-request.dto';

@Injectable({
  providedIn: 'root'
})
export class BankAccountService {
  private baseUrl = 'http://localhost:8081/api/v1/bank-accounts';

  constructor(private http: HttpClient) {}

  getAll(): Observable<BankAccount[]> {
    return this.http.get<BankAccount[]>(this.baseUrl);
  }

  getById(id: string): Observable<BankAccount> {
    return this.http.get<BankAccount>(`${this.baseUrl}/${id}`);
  }

  create(account: BankAccountRequest): Observable<BankAccount> {
    return this.http.post<BankAccount>(this.baseUrl, account);
  }

  update(id: string, account: BankAccountRequest): Observable<BankAccount> {
    return this.http.put<BankAccount>(`${this.baseUrl}/${id}`, account);
  }
  

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
