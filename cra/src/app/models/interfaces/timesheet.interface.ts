import { Status } from "../enums/status.enum";
import { WorkPeriodType } from "../enums/work-period-type.enum";
import { FileModel } from "./file.interface";
import { AppUser } from "./user.interface";


export interface WorkPeriod {
    day: string;
    period: WorkPeriodType;
}

export interface Timesheet {
    id: string;
    date: string;
    status: Status;
    collaborateur: AppUser;
    manager: AppUser;
    comments: Comment[];
    selectedPeriods: WorkPeriod[];
    valeurJour: { [key: string]: string };
    files: FileModel[];
  }