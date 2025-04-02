import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MissionService } from 'src/app/services/mission.service';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import Swal from 'sweetalert2';
import { MissionSimple, Mission } from 'src/app/models/interfaces/mission.interface';
import { TimeUnit } from 'src/app/models/enums/time-unit.enum';
import { CompanyService } from 'src/app/services/company.service';
import { PaymentTermService } from 'src/app/services/payment-term.service';
import { UserService } from 'src/app/services/user.service';
import { BankAccountService } from 'src/app/services/bank-account.service';

import { InvoicingConditionService } from 'src/app/services/invoicing-condition.service';

import { ServiceContractService } from 'src/app/services/service-contract.service';

import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-missions',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './missions.component.html',
  styleUrls: ['./missions.component.scss']
})
export class MissionsComponent implements OnInit {
  missions: MissionSimple[] = [];
  filteredMissions: MissionSimple[] = [];
  searchTerm: string = '';

  timeUnits = Object.values(TimeUnit);
  newMission: Partial<Mission> = {
    nonRenewable: false,
    finalClient: false,
    invoiceRecipient: false
  };

  companies: any[] = [];
  paymentTerms: any[] = [];
  users: any[] = [];
  bankAccounts: any[] = [];
  invoicingConditions: any[] = [];
  serviceContracts: any[] = [];

  constructor(
    private missionService: MissionService,
    private companyService: CompanyService,
    private paymentTermService: PaymentTermService,
    private userService: UserService,
    private bankAccountService: BankAccountService,
    private invoicingConditionsService: InvoicingConditionService,
    private serviceContractService: ServiceContractService
  ) {}

  ngOnInit(): void {
    this.loadMissions();
    this.loadDropdowns();
  }

  loadMissions(): void {
    this.missionService.getAll().subscribe({
      next: (response) => {
        this.missions = (response.content ?? []).map(mission => ({
          ...mission,
          timeUnit: TimeUnit[mission.timeUnit as keyof typeof TimeUnit]
        }));
        this.filteredMissions = [...this.missions];
        console.log('Loaded missions:', this.missions); // ✅ for debug
      },
      error: () => Swal.fire('Error', 'Failed to load missions', 'error')
    });
  }
  
  

  loadDropdowns(): void {
    this.companyService.getAll().subscribe(data => this.companies = data || []);
    this.paymentTermService.getAll().subscribe(data => this.paymentTerms = data.content || []);
    this.userService.getAllUsers().subscribe(data => this.users = data.content || []);
    this.bankAccountService.getAll().subscribe(data => this.bankAccounts = data || []);
    this.invoicingConditionsService.getAll().subscribe(data => {
      this.invoicingConditions = Array.isArray(data) ? data : data?.content || [];
    });
    this.serviceContractService.getAll().subscribe(data => this.serviceContracts = data || []);
  }
  
  

  filterMissions(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredMissions = this.missions.filter(m =>
      m.title.toLowerCase().includes(term) ||
      m.reference.toLowerCase().includes(term)
    );
  }

  deleteMission(id: string): void {
    const mission = this.missions.find(m => m.id === id);
    if (!mission) return;

    Swal.fire({
      title: 'Are you sure?',
      text: `Delete mission: ${mission.title}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then(result => {
      if (result.isConfirmed) {
        this.missionService.deleteMission(id).subscribe({
          next: () => {
            this.missions = this.missions.filter(m => m.id !== id);
            this.filteredMissions = [...this.missions];
            Swal.fire('Deleted!', 'Mission has been deleted.', 'success');
          },
          error: () => Swal.fire('Error', 'Failed to delete mission', 'error')
        });
      }
    });
  }

  addMission(): void {
    // Validate required relationships
    if (
      !this.newMission.companyId ||
      !this.newMission.paymentTermId ||
      !this.newMission.supplierAdminId ||
      !this.newMission.bankAccountId ||
      !this.newMission.invoicingConditionId ||
      !this.newMission.serviceContractId
    ) {
      Swal.fire('Error', 'Please fill in all required fields including related entities.', 'error');
      return;
    }
  
    // Convert to payload with full relationship objects
    const payload: any = {
      ...this.newMission,
  
      // Convert relationships to full objects (only send { id: string })
      company: { id: this.newMission.companyId },
      paymentTerm: { id: this.newMission.paymentTermId },
      supplierAdmin: { id: this.newMission.supplierAdminId },
      bankAccount: { id: this.newMission.bankAccountId },
      invoicingCondition: { id: this.newMission.invoicingConditionId },
      serviceContract: { id: this.newMission.serviceContractId },
  
      // Collaborateur is optional
      collaborateur: this.newMission.collaborateurId
        ? { id: this.newMission.collaborateurId }
        : null
    };
  
    // Clean up raw IDs
    delete payload.companyId;
    delete payload.paymentTermId;
    delete payload.supplierAdminId;
    delete payload.collaborateurId;
    delete payload.bankAccountId;
    delete payload.invoicingConditionId;
    delete payload.serviceContractId;
  
    // Send to backend
    this.missionService.addMission(payload).subscribe({
      next: () => {
        this.loadMissions();
        this.newMission = {
          nonRenewable: false,
          finalClient: false,
          invoiceRecipient: false
        };
        Swal.fire('Success', 'Mission created!', 'success');
  
        // Close modal
        const modalEl = document.getElementById('addMissionModal');
        if (modalEl) {
          const modalInstance = bootstrap.Modal.getInstance(modalEl);
          modalInstance?.hide();
        }
      },
      error: (err) => {
        Swal.fire('Error', err?.error || 'Failed to create mission.', 'error');
      }
    });
  }
  
  editMission: {
    id?: string;
    fees?: number;
    missionDuration?: number;
    startDate?: string;
    endDate?: string;
  } = {};
  
  
  setEditMission(mission: MissionSimple): void {
    this.editMission = {
      id: mission.id,
      fees: mission.fees,
      missionDuration: mission.missionDuration,
      startDate: mission.startDate,
      endDate: mission.endDate
    };
  }

  updateMission(): void {
    if (!this.editMission.id) return;
  
    const payload = {
      fees: this.editMission.fees,
      missionDuration: this.editMission.missionDuration,
      startDate: this.editMission.startDate,
      endDate: this.editMission.endDate
    };
  
    this.missionService.updateMission(this.editMission.id, payload).subscribe({
      next: () => {
        this.loadMissions();
        Swal.fire('Success', 'Mission updated successfully!', 'success');
  
        // Close the modal
        const modalEl = document.getElementById('editMissionModal');
        if (modalEl) {
          const modal = bootstrap.Modal.getInstance(modalEl);
          modal?.hide();
        }
      },
      error: () => {
        Swal.fire('Error', 'Failed to update mission', 'error');
      }
    });
  }

  
  
  
  
}
