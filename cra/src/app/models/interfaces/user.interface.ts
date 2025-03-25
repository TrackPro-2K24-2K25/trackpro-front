import { Address } from './address.interface';
import { ContactInfo } from './contact-info.interface';
import { ProfileInfo } from './profile-info.interface';
import { AuditInfo } from './audit-info.interface';
import { Role } from '../enums/role.enum';

export interface AppUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password?: string; 
  role: Role;
  contactInfo: ContactInfo;
  address: Address;
  profileInfo: ProfileInfo;
  auditInfo: AuditInfo;
}
