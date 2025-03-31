import { Company } from './company.interface';

export interface BankAccount {
  id?: string;
  accountNumber: string;
  bankName: string;
  iban: string;
  bic: string;
  company: Company;
  missions?: any[] | null;
}