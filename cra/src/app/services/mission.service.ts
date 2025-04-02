import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../models/interfaces/paginated-response.interface';

export interface MissionSimple {
  id: string;
  title: string;
  reference: string;
  fees: number;
  timeUnit: string;
  missionDuration: number;
  startDate: string;
  endDate: string;
  nonRenewable: boolean;
  finalClient: boolean;
  invoiceRecipient: boolean;
}

export interface MissionFull extends MissionSimple {
  companyId: string;
  paymentTermId: string;
  supplierAdminId: string;
  collaborateurId?: string; // Nullable field
  bankAccountId: string;
  invoicingConditionId: string;
  serviceContractId: string;
}

@Injectable({
  providedIn: 'root'
})
export class MissionService {
  private apiUrl = 'http://localhost:8081/api/v1/missions'; // Update this with your backend URL

  constructor(private http: HttpClient) {}

 

  // ✅ Alias for compatibility
  getMissions(): Observable<PaginatedResponse<MissionSimple>> {
    return this.http.get<PaginatedResponse<MissionSimple>>(this.apiUrl);
  }
  
  // Optional alias for consistency
  getAll(): Observable<PaginatedResponse<MissionSimple>> {
    return this.getMissions();
  }
  

  delete(id: string): Observable<void> {
    return this.deleteMission(id);
  }

  /**
   * Get all missions (returns simplified data for table display).
   */
  

  /**
   * Get a specific mission by ID.
   */
  getMissionById(id: string): Observable<MissionFull> {
    return this.http.get<MissionFull>(`${this.apiUrl}/${id}`);
  }

  /**
   * Add a new mission (requires full details with foreign keys).
   */
  addMission(mission: MissionFull): Observable<MissionFull> {
    return this.http.post<MissionFull>(this.apiUrl, mission);
  }

  /**
   * Update an existing mission.
   */
  updateMission(id: string, mission: MissionFull): Observable<MissionFull> {
    return this.http.put<MissionFull>(`${this.apiUrl}/${id}`, mission);
  }

  /**
   * Delete a mission by ID.
   */
  deleteMission(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
}
