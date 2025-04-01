// src/app/models/interfaces/company.interface.ts
import { AppUser } from './user.interface';
import { BankAccount } from './bank-account.interface';
import { Mission } from './mission.interface';
import { InvoicingConditions } from './invoicing-conditions.interface';
import { PaymentTerm } from './payment-term.interface';
import { InvoicingCurrency } from './invoicing-currency.interface';

export interface Company {
  id: string;
  name?: string;
  address?: string;
  pays?: string;
  companyType?: string;
  creationDate?: string;
  nrcs?: number;
  nic?: number;
  siret?: number;
  legalForm?: string;
  vat?: string;
  shareCapital?: number;
  rcsCity?: string;
  note?: string;
  missions?: Mission[] | null;
  bankAccounts?: BankAccount[] | null;
  invoicingConditions?: InvoicingConditions | null;
  paymentTerm?: PaymentTerm | null;
  invoicingCurrency?: InvoicingCurrency | null;
  manager?: AppUser | null;
  invoicingConditionsId?: string | null;
  invoicingCurrencyId?: string| null;
  managerId?: string | null;

}
