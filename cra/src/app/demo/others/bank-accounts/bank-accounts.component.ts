import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BankAccountService } from 'src/app/services/bank-account.service';
import { CompanyService } from 'src/app/services/company.service';
import { BankAccount } from 'src/app/models/interfaces/bank-account.interface';
import { Company } from 'src/app/models/interfaces/company.interface';
import { BankAccountRequest } from 'src/app/models/dto/bank-account-request.dto';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';

@Component({
  selector: 'app-bank-accounts',
  standalone: true,
  templateUrl: './bank-accounts.component.html',
  styleUrls: ['./bank-accounts.component.scss'],
  imports: [CommonModule, FormsModule, CardComponent]
})
export class BankAccountsComponent implements OnInit, AfterViewInit {
  bankAccounts: BankAccount[] = [];
  paginatedAccounts: BankAccount[] = [];
  companies: Company[] = [];

  newAccount: {
    accountNumber: string;
    bankName: string;
    iban: string;
    bic: string;
    company?: Company;
  } = {
    accountNumber: '',
    bankName: '',
    iban: '',
    bic: '',
    company: undefined
  };

  selectedAccount: BankAccount = {
    id: '',
    accountNumber: '',
    bankName: '',
    iban: '',
    bic: '',
    company: {
      id: '',
      name: '',
      address: '',
      pays: '',
      companyType: '',
      creationDate: '',
      NRCS: 0,
      NIC: 0,
      SIRET: 0,
      vat: '',
      shareCapital: 0
    },
    missions: []
  };

  searchTerm = '';
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  modalInstance: any;

  constructor(
    private bankAccountService: BankAccountService,
    private companyService: CompanyService
  ) {}

  ngOnInit(): void {
    this.loadCompanies();
    this.loadBankAccounts();
  }

  ngAfterViewInit(): void {
    const modalElement = document.getElementById('addBankAccountModal');
    if (modalElement) {
      this.modalInstance = new bootstrap.Modal(modalElement);
    }
  }

  loadCompanies(): void {
    this.companyService.getAll().subscribe({
      next: (res: any) => {
        console.log('[Companies Loaded]', res);
        this.companies = Array.isArray(res) ? res : res.content || [];
      },
      error: (err) => {
        console.error('[Load Companies Error]', err);
      }
    });
  }

  loadBankAccounts(): void {
    this.bankAccountService.getAll().subscribe({
      next: (accounts: BankAccount[]) => {
        console.log('[Bank Accounts Loaded]', accounts);
        this.bankAccounts = accounts;
        this.filterAccounts();
      },
      error: (err) => {
        console.error('[Load Bank Accounts Error]', err);
      }
    });
  }

  addBankAccount(): void {
    if (
      !this.newAccount.accountNumber ||
      !this.newAccount.bankName ||
      !this.newAccount.iban ||
      !this.newAccount.bic ||
      !this.newAccount.company
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Fields',
        text: 'Please fill all fields before saving!',
        confirmButtonColor: '#d33'
      });
      return;
    }

    const payload: BankAccountRequest = {
      accountNumber: this.newAccount.accountNumber,
      bankName: this.newAccount.bankName,
      iban: this.newAccount.iban,
      bic: this.newAccount.bic,
      companyId: this.newAccount.company.id
    };

    this.bankAccountService.create(payload).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Bank Account Created',
          confirmButtonColor: '#3085d6'
        });

        this.newAccount = {
          accountNumber: '',
          bankName: '',
          iban: '',
          bic: '',
          company: undefined
        };
        this.modalInstance?.hide();
        this.loadBankAccounts();
      },
      error: (error) => {
        const errorMessage = error?.error || 'Something went wrong while creating the account.';
        Swal.fire({
          icon: 'error',
          title: 'Creation Failed',
          text: errorMessage,
          confirmButtonColor: '#d33'
        });
        console.error('[Create Bank Account Error]', error);
      }
    });
  }

  openEditModal(account: BankAccount): void {
    this.selectedAccount = { ...account };
  }

  updateBankAccount(): void {
    if (
      !this.selectedAccount.id ||
      !this.selectedAccount.accountNumber ||
      !this.selectedAccount.bankName ||
      !this.selectedAccount.iban ||
      !this.selectedAccount.bic ||
      !this.selectedAccount.company
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Fields',
        text: 'Please fill all fields before updating!',
        confirmButtonColor: '#d33'
      });
      return;
    }

    const payload: BankAccountRequest = {
      accountNumber: this.selectedAccount.accountNumber,
      bankName: this.selectedAccount.bankName,
      iban: this.selectedAccount.iban,
      bic: this.selectedAccount.bic,
      companyId: this.selectedAccount.company.id
    };

    this.bankAccountService.update(this.selectedAccount.id!, payload).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Bank Account Updated',
          confirmButtonColor: '#3085d6'
        });

        const modalEl = document.getElementById('editBankAccountModal');
        if (modalEl) {
          const modal = bootstrap.Modal.getInstance(modalEl);
          modal?.hide();
        }

        this.loadBankAccounts();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: err?.error || 'An error occurred during update',
          confirmButtonColor: '#d33'
        });
        console.error('[Update Error]', err);
      }
    });
  }

  filterAccounts(): void {
    const term = this.searchTerm.toLowerCase().trim();

    const filtered = this.bankAccounts.filter(account =>
      account.accountNumber.toLowerCase().includes(term) ||
      account.bankName.toLowerCase().includes(term) ||
      account.iban.toLowerCase().includes(term) ||
      account.bic.toLowerCase().includes(term) ||
      (account.company?.name?.toLowerCase().includes(term) ?? false)
    );

    this.totalPages = Math.max(1, Math.ceil(filtered.length / this.pageSize));
    this.paginatedAccounts = filtered.slice(
      (this.currentPage - 1) * this.pageSize,
      this.currentPage * this.pageSize
    );
  }

  sortTable(column: keyof BankAccount): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.bankAccounts.sort((a, b) => {
      const valA = (a[column] || '').toString().toLowerCase();
      const valB = (b[column] || '').toString().toLowerCase();
      return valA.localeCompare(valB) * (this.sortDirection === 'asc' ? 1 : -1);
    });

    this.filterAccounts();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.filterAccounts();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.filterAccounts();
    }
  }

  getCompanyNameById(companyId: string): string {
    const company = this.companies.find(c => c.id === companyId);
    return company ? company.name : 'Unknown';
  }
}
