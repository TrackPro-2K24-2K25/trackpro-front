import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';

import { Timesheet } from 'src/app/models/interfaces/timesheet.interface';
import { TimesheetService } from 'src/app/services/timesheet.service';
import { Status } from 'src/app/models/enums/status.enum';

@Component({
  selector: 'app-timesheet',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './timesheets.component.html',
  styleUrls: ['./timesheets.component.scss']
})
export class TimesheetsComponent implements OnInit {
  timesheets: Timesheet[] = [];
  filteredTimesheets: Timesheet[] = [];
  paginatedTimesheets: Timesheet[] = [];

  selectedTimesheet: Timesheet | null = null;
  selectedStatus: Status = Status.PENDING;
  Status = Status;
  statusOptions: Status[] = Object.values(Status);

  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private timesheetService: TimesheetService) {}

  ngOnInit(): void {
    this.loadTimesheets();
  }

  loadTimesheets(): void {
    this.timesheetService.getAll().subscribe({
      next: (response) => {
        this.timesheets = response.content ?? [];
        this.filteredTimesheets = [...this.timesheets];
        this.updatePagination();
      },
      error: () => Swal.fire('Error', 'Failed to load timesheets', 'error')
    });
  }

  filterTimesheets(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredTimesheets = this.timesheets.filter(t =>
      t.collaborateur?.firstName?.toLowerCase().includes(term) ||
      t.collaborateur?.lastName?.toLowerCase().includes(term) ||
      t.manager?.firstName?.toLowerCase().includes(term) ||
      t.manager?.lastName?.toLowerCase().includes(term)
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    const totalItems = this.filteredTimesheets.length;
    this.totalPages = Math.ceil(totalItems / this.pageSize);
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedTimesheets = this.filteredTimesheets.slice(start, end);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  sortTable(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredTimesheets.sort((a, b) => {
      const aValue = this.extractSortValue(a, column)?.toString().toLowerCase() ?? '';
      const bValue = this.extractSortValue(b, column)?.toString().toLowerCase() ?? '';

      return this.sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

    this.updatePagination();
  }

  private extractSortValue(item: Timesheet, column: string): string | Date | undefined {
    switch (column) {
      case 'collaborateur':
        return `${item.collaborateur?.firstName ?? ''} ${item.collaborateur?.lastName ?? ''}`;
      case 'manager':
        return `${item.manager?.firstName ?? ''} ${item.manager?.lastName ?? ''}`;
      case 'date':
        return item.date;
      default:
        return '';
    }
  }

  openEditModal(timesheet: Timesheet): void {
    this.selectedTimesheet = { ...timesheet };
    this.selectedStatus = timesheet.status;
    const modal = new bootstrap.Modal(document.getElementById('editTimesheetModal')!);
    modal.show();
  }

  updateStatus(): void {
    if (!this.selectedTimesheet) return;

    const updated: Timesheet = {
      ...this.selectedTimesheet,
      status: this.selectedStatus
    };

    this.timesheetService.update(this.selectedTimesheet.id, { status: updated.status }).subscribe({
      next: () => {
        this.loadTimesheets();
        Swal.fire('Success', 'Status updated!', 'success');
        bootstrap.Modal.getInstance(document.getElementById('editTimesheetModal')!)?.hide();
      },
      error: () => Swal.fire('Error', 'Failed to update status', 'error')
    });
  }

  openViewModal(timesheet: Timesheet): void {
    this.selectedTimesheet = timesheet;
    const modal = new bootstrap.Modal(document.getElementById('viewTimesheetModal')!);
    modal.show();
  }

  getFileUrl(filePath: string): string {
    return `https://njrreimpmqnuvkdndcnq.supabase.co/storage/v1/object/public/expense-files/${filePath}`;
  }
}
