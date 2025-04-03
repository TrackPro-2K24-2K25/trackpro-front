import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';

import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { ExpenseReportService } from 'src/app/services/expense-report.service';
import { ExpenseReport } from 'src/app/models/interfaces/expense-report.interface';
import { Status } from 'src/app/models/enums/status.enum';
import { MissionService } from 'src/app/services/mission.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-expense-report',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './expense-report.component.html',
  styleUrls: ['./expense-report.component.scss']
})
export class ExpenseReportComponent implements OnInit {
  expenseReports: ExpenseReport[] = [];
  filteredReports: ExpenseReport[] = [];
  searchTerm: string = '';

  missions: any[] = [];
  users: any[] = [];

  uploadedFiles: File[] = [];

  newReport: Partial<ExpenseReport> & {
    missionId?: string;
    collaborateurId?: string;
    managerId?: string;
  } = this.initNewReport();

  constructor(
    private expenseReportService: ExpenseReportService,
    private missionService: MissionService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadReports();
    this.loadDropdowns();
  }

  loadReports(): void {
    this.expenseReportService.getAllReports().subscribe({
      next: (response) => {
        this.expenseReports = response.content ?? [];
        this.filteredReports = [...this.expenseReports];
      },
      error: () => Swal.fire('Error', 'Failed to load expense reports', 'error')
    });
  }

  loadDropdowns(): void {
    this.missionService.getAll().subscribe(data => this.missions = data.content ?? []);
    this.userService.getAllUsers().subscribe(data => this.users = data.content ?? []);
  }

  filterReports(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredReports = this.expenseReports.filter(report =>
      report.description?.toLowerCase().includes(term)
    );
  }

  addExpenseReport(): void {
    if (!this.newReport.description?.trim()) {
      Swal.fire('Warning', 'Description is required', 'warning');
      return;
    }

    const payload: ExpenseReport = {
      description: this.newReport.description!,
      travelAmount: this.newReport.travelAmount ?? 0,
      accommodationAmount: this.newReport.accommodationAmount ?? 0,
      mealAmount: this.newReport.mealAmount ?? 0,
      otherAmount: this.newReport.otherAmount ?? 0,
      status: Status.PENDING,
      mission: { id: this.newReport.missionId! } as any,
      collaborateur: { id: this.newReport.collaborateurId! } as any,
      manager: { id: this.newReport.managerId! } as any,
      files: [] // You can push uploaded file references here once upload is integrated
    };

    this.expenseReportService.createReport(payload, this.uploadedFiles).subscribe({
      next: () => {
        this.loadReports();
        Swal.fire('Success', 'Expense Report created!', 'success');

        const modal = bootstrap.Modal.getInstance(document.getElementById('addExpenseReportModal')!);
        modal?.hide();

        this.newReport = this.initNewReport();
        this.uploadedFiles = [];
      },
      error: () => Swal.fire('Error', 'Failed to create expense report', 'error')
    });
  }

  getTotal(report: ExpenseReport): number {
    return (
      (report.travelAmount ?? 0) +
      (report.accommodationAmount ?? 0) +
      (report.mealAmount ?? 0) +
      (report.otherAmount ?? 0)
    );
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    for (let i = 0; i < input.files.length; i++) {
      const file = input.files.item(i);
      if (file) {
        this.uploadedFiles.push(file);
      }
    }
  }

  private initNewReport(): Partial<ExpenseReport> & {
    missionId?: string;
    collaborateurId?: string;
    managerId?: string;
  } {
    return {
      description: '',
      travelAmount: 0,
      accommodationAmount: 0,
      mealAmount: 0,
      otherAmount: 0,
      status: Status.PENDING,
      missionId: '',
      collaborateurId: '',
      managerId: ''
    };
  }
}
