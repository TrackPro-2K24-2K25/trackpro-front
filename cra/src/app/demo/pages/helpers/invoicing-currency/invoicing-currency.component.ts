import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-invoicing-currency',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './invoicing-currency.component.html',
  styleUrls: ['./invoicing-currency.component.scss']
})
export class InvoicingCurrencyComponent {
  searchTerm = '';
  newCurrency = { value: '' };
  paginatedCurrencies = [];
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
    this.totalPages = Math.ceil(this.paginatedCurrencies.length / this.pageSize);
    this.paginatedCurrencies = this.paginatedCurrencies.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
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

    this.paginatedCurrencies.sort((a, b) => {
      let valueA = a[column].toString().toLowerCase();
      let valueB = b[column].toString().toLowerCase();
      return this.sortDirection === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    });

    this.updatePagination();
  }

  filterCurrencies() {
    const lowerCaseSearch = this.searchTerm.toLowerCase().trim();
    this.paginatedCurrencies = this.paginatedCurrencies.filter(currency =>
      currency.value.toLowerCase().includes(lowerCaseSearch)
    );
    this.updatePagination();
  }

  ngAfterViewInit() {
    const modalElement = document.getElementById('addCurrencyModal');
    if (modalElement) {
      this.modalInstance = new bootstrap.Modal(modalElement);
    }
  }

  addCurrency() {
    if (!this.newCurrency.value.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Fields',
        text: 'Currency value cannot be empty!',
        confirmButtonColor: '#d33'
      });
      return;
    }
    this.paginatedCurrencies.push({ ...this.newCurrency });
    this.newCurrency.value = '';
    this.updatePagination();
    Swal.fire({
      icon: 'success',
      title: 'Currency Added',
      text: 'The invoicing currency has been successfully added!',
      confirmButtonColor: '#3085d6'
    });
    this.modalInstance.hide();
  }
}
