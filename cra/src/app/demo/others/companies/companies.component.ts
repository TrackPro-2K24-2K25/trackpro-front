import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';

import { Company } from 'src/app/models/interfaces/company.interface';
import { CompanyService } from 'src/app/services/company.service';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';

import { CompanyType } from 'src/app/models/enums/company-type.enum';
import { VAT } from 'src/app/models/enums/vat.enum';
import { InvoicingConditions } from 'src/app/models/interfaces/invoicing-conditions.interface';
import { PaymentTerm } from 'src/app/models/interfaces/payment-term.interface';
import { InvoicingCurrency } from 'src/app/models/interfaces/invoicing-currency.interface';
import { AppUser } from 'src/app/models/interfaces/user.interface';

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompanyComponent implements OnInit {
  companies: Company[] = [];
  paginatedCompanies: Company[] = [];

  newCompany: any = {};
  selectedCompany: Company | null = null;

  searchTerm = '';
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;

  sortColumn: keyof Company = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  modalInstance: any;

  companyTypes = Object.values(CompanyType);
  vatOptions = Object.entries(VAT)
    .filter(([key]) => isNaN(Number(key)))
    .map(([key, value]) => ({ key, value }));

  invoicingConditionsList: InvoicingConditions[] = [];
  paymentTermsList: PaymentTerm[] = [];
  invoicingCurrenciesList: InvoicingCurrency[] = [];
  userList: AppUser[] = [];

  constructor(private companyService: CompanyService) {}

  ngOnInit(): void {
    this.loadCompanies();
    this.loadDropdownData();
  }

  loadDropdownData(): void {
    this.companyService.getInvoicingConditions().subscribe(data => this.invoicingConditionsList = data);
    this.companyService.getPaymentTerms().subscribe(data => this.paymentTermsList = data);
    this.companyService.getInvoicingCurrencies().subscribe(data => this.invoicingCurrenciesList = data);
    this.companyService.getManagers().subscribe(data => this.userList = data);
  }

  loadCompanies(): void {
    this.companyService.getAll().subscribe({
      next: (data) => {
        this.companies = data;
        this.filterCompanies();
      },
      error: () => Swal.fire('Error', 'Failed to load companies.', 'error')
    });
  }

  addCompany(): void {
    if (this.newCompany.creationDate && !this.newCompany.creationDate.includes('T')) {
      this.newCompany.creationDate += 'T00:00:00';
    }
  
    this.newCompany.nrcs = this.newCompany.nrcs ? Number(this.newCompany.nrcs) : undefined;
    this.newCompany.nic = this.newCompany.nic ? Number(this.newCompany.nic) : undefined;
    this.newCompany.siret = this.newCompany.siret ? Number(this.newCompany.siret) : undefined;
    this.newCompany.shareCapital = this.newCompany.shareCapital ? Number(this.newCompany.shareCapital) : undefined;
  
    const payload: Company = {
      ...this.newCompany,
      invoicingConditions: this.newCompany.invoicingConditions,
      invoicingCurrency: this.newCompany.invoicingCurrency,
      manager: this.newCompany.manager
    };
  
    this.companyService.create(payload).subscribe({
      next: (created) => {
        this.companies.push(created);
        this.filterCompanies();
        this.newCompany = {};
        Swal.fire('Success', 'Company added!', 'success');
        const modal = bootstrap.Modal.getInstance(document.getElementById('addCompanyModal')!)!;
        modal.hide();
      },
      error: (err) => {
        console.error('❌ Backend error:', err);
        Swal.fire('Error', err?.error || 'Failed to create company.', 'error');
      }
    });
  }
  

  editCompany(company: Company): void {
    this.selectedCompany = { ...company };
    const modalElement = document.getElementById('editCompanyModal');
    if (modalElement) {
      this.modalInstance = new bootstrap.Modal(modalElement);
      this.modalInstance.show();
    }
  }

  updateCompany(): void {
    if (!this.selectedCompany) return;

    if (this.selectedCompany.creationDate && !this.selectedCompany.creationDate.includes('T')) {
      this.selectedCompany.creationDate += 'T00:00:00';
    }

    this.companyService.update(this.selectedCompany.id, this.selectedCompany).subscribe({
      next: (updated) => {
        const index = this.companies.findIndex(c => c.id === updated.id);
        if (index !== -1) this.companies[index] = updated;
        this.filterCompanies();
        Swal.fire('Success', 'Company updated!', 'success');
        this.modalInstance.hide();
      },
      error: (err) => {
        console.error('❌ Update error:', err);
        Swal.fire('Error', err?.error || 'Failed to update company.', 'error');
      }
    });
  }

  deleteCompany(company: Company): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Delete ${company.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.isConfirmed) {
        this.companyService.delete(company.id).subscribe({
          next: () => {
            this.companies = this.companies.filter(c => c.id !== company.id);
            this.filterCompanies();
            Swal.fire('Deleted!', 'Company deleted.', 'success');
          },
          error: () => Swal.fire('Error', 'Failed to delete company.', 'error')
        });
      }
    });
  }

  filterCompanies(): void {
    const lowerSearch = this.searchTerm.toLowerCase().trim();
    const filtered = this.companies.filter(company =>
      (company.name?.toLowerCase().includes(lowerSearch) ||
       company.address?.toLowerCase().includes(lowerSearch))
    );
    this.paginatedCompanies = [...filtered];
    this.sortTable(this.sortColumn);
    this.updatePagination();
  }

  sortTable(column: keyof Company): void {
    if (!column) return;
    this.sortDirection = this.sortColumn === column ? (this.sortDirection === 'asc' ? 'desc' : 'asc') : 'asc';
    this.sortColumn = column;

    this.paginatedCompanies.sort((a, b) => {
      const valA = (a[column] ?? '').toString().toLowerCase();
      const valB = (b[column] ?? '').toString().toLowerCase();
      return this.sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

    this.updatePagination();
  }

  updatePagination(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    const totalItems = this.paginatedCompanies.length;
    this.totalPages = Math.ceil(totalItems / this.pageSize);
    this.paginatedCompanies = this.paginatedCompanies.slice(start, end);
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
}