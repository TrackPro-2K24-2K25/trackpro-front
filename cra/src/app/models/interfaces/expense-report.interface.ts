import { Status } from '../enums/status.enum';
import { MissionSimple } from './mission.interface';
import { AppUser } from './user.interface';
import { FileModel } from './file.interface';

export interface ExpenseReport {
  id?: string;
  description: string;
  travelAmount: number;
  accommodationAmount: number;
  mealAmount: number;
  otherAmount: number;
  totalAmount?: number;
  status: Status;
  submissionDate?: string;
  mission: MissionSimple;
  collaborateur: AppUser;
  manager: AppUser;
  files: FileModel[];
}
