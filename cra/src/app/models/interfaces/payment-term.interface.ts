export interface PaymentTerm {
    id: string;
    value: string;
    description: string;
    days: number;
    default: boolean;
    active: boolean;
    invoicingConditions ?: any[]; 
  }