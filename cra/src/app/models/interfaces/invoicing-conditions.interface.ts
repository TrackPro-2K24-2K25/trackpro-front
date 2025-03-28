import { PaymentTerm } from './payment-term.interface';


export interface InvoicingConditions {
  id?: string;
  paymentTerm: PaymentTerm; // ✅ Full object because it's a @ManyToOne relationship
  discount: number;
  daysForDiscount: number;
  lateFeeRate: number;
  isActive: boolean;
  }
  