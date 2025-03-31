export interface Company {
    id: string;
    name: string;
    address: string;
    pays: string;
    companyType: string;
    creationDate: string;
    NRCS: number;
    NIC: number;
    SIRET: number;
    vat: string;
    shareCapital: number;
    legalForm?: string;
    RCSCity?: string;
    note?: string;
    invoicingConditionsId?: string;
    paymentTermId?: string;
    invoicingCurrencyId?: string;
    managerId?: string;
  }