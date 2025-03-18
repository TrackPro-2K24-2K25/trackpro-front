import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import * as bootstrap from 'bootstrap';
import Swal from 'sweetalert2'; 


@Component({
  selector: 'app-bank-accounts',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './bank-accounts.component.html',
  styleUrls: ['./bank-accounts.component.scss']
})
export class BankAccountsComponent {
  bankAccounts = [
    { accountNumber: '1234567890', bankName: 'Bank of America', iban: 'US12345678901234567890', bic: 'BOFAUS3NXXX', company: 'Tech Corp' },
    { accountNumber: '9876543210', bankName: 'HSBC Bank', iban: 'GB12MIDL40051512345678', bic: 'HBUKGB4BXXX', company: 'Finance Ltd' },
    { accountNumber: '5432167890', bankName: 'Deutsche Bank', iban: 'DE89370400440532013000', bic: 'DEUTDEFFXXX', company: 'Auto GmbH' }
  ];

  
  companies = ['Tech Corp', 'Finance Ltd', 'Auto GmbH']; // Dummy Company List
  newAccount = { accountNumber: '', bankName: '', iban: '', bic: '', company: '' };

  paginatedAccounts = [...this.bankAccounts]; // Copy of the original data
  searchTerm = '';
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  modalInstance: any;

  constructor() {
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.paginatedAccounts.length / this.pageSize);
    this.paginatedAccounts = this.paginatedAccounts.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  sortTable(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.paginatedAccounts.sort((a, b) => {
      let valueA = a[column].toString().toLowerCase();
      let valueB = b[column].toString().toLowerCase();

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.updatePagination();
  }

  filterAccounts() {
    const lowerCaseSearch = this.searchTerm.toLowerCase().trim();

    this.paginatedAccounts = this.bankAccounts.filter(account =>
      Object.values(account).some(value =>
        value.toString().toLowerCase().includes(lowerCaseSearch)
      )
    );

    this.updatePagination(); // Update pagination after filtering
  }

  ngAfterViewInit() {
    const modalElement = document.getElementById('addBankAccountModal');
    if (modalElement) {
      this.modalInstance = new bootstrap.Modal(modalElement);
    }
  }

  addBankAccount() {
    if (!this.newAccount.accountNumber || !this.newAccount.bankName || !this.newAccount.iban || !this.newAccount.bic || !this.newAccount.company) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Fields',
        text: 'Please fill all fields before saving!',
        confirmButtonColor: '#d33'
      });
      return;
    }
  
    // Add new account to the list
    this.bankAccounts.push({ ...this.newAccount });
  
    // Reset the form
    this.newAccount = { accountNumber: '', bankName: '', iban: '', bic: '', company: '' };
  
    // Update pagination
    this.updatePagination();
  
    // Show success message
    Swal.fire({
      icon: 'success',
      title: 'Bank Account Created',
      text: 'The bank account has been successfully added!',
      confirmButtonColor: '#3085d6'
    });
  
    // Close the modal manually
    this.modalInstance.hide();
  }
  
  
  
}
