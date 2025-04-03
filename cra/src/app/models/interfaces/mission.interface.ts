import { TimeUnit } from '../enums/time-unit.enum';
import { AppUser } from 'src/app/models/interfaces/user.interface';

export interface MissionSimple {
  id: string;
  title: string;
  reference: string;
  fees: number;
  timeUnit: TimeUnit;
  missionDuration: number;
  startDate: string;
  endDate: string;
  nonRenewable: boolean;
  finalClient: boolean;
  invoiceRecipient: boolean;
}

export interface Mission extends MissionSimple {
  companyId: string;
  paymentTermId: string;
  supplierAdminId: string;
  collaborateurId?: string;
  bankAccountId: string;
  invoicingConditionId: string;
  serviceContractId: string;
}

export interface UpdateMissionRequest {
  fees: number;
  missionDuration: number;
  startDate: string;
  endDate: string;
}

interface MissionExtended extends MissionSimple {
  supplierAdmin?: AppUser;
  collaborateur?: AppUser;
}

