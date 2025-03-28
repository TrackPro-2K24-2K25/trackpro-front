import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';
import { InvoicingCurrency } from './../../../../models/interfaces/invoicing-currency.interface';
import { InvoicingCurrencyService } from './../../../../services/invoicing-currency.service';

@Component({
  selector: 'app-invoicing-currency',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './invoicing-currency.component.html',
  styleUrls: ['./invoicing-currency.component.scss']
})
export class InvoicingCurrencyComponent implements OnInit {
  currencies: InvoicingCurrency[] = [];
  paginatedCurrencies: InvoicingCurrency[] = [];
  newCurrency: Partial<InvoicingCurrency> = { value: '' };
  selectedCurrency: InvoicingCurrency | null = null;

  searchTerm = '';
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  modalInstance: any;

  constructor(private currencyService: InvoicingCurrencyService) {}

  ngOnInit(): void {
    this.loadCurrencies();
  }

  ngAfterViewInit() {
    const modalElement = document.getElementById('addCurrencyModal');
    if (modalElement) {
      this.modalInstance = new bootstrap.Modal(modalElement);
    }
  }

  loadCurrencies(): void {
    this.currencyService.getAll().subscribe({
      next: (data) => {
        this.currencies = data;
        this.filterCurrencies();
      },
      error: () => {
        Swal.fire('Error', 'Failed to load currencies', 'error');
      }
    });
  }

  addCurrency(): void {
    if (!this.newCurrency.value?.trim()) {
      Swal.fire('Missing Fields', 'Currency value cannot be empty!', 'error');
      return;
    }

    this.currencyService.create(this.newCurrency).subscribe({
      next: (created) => {
        this.currencies.push(created);
        this.filterCurrencies();
        this.newCurrency = { value: '' };
        this.modalInstance.hide();
        Swal.fire('Success', 'Currency added!', 'success');
      },
      error: () => {
        Swal.fire('Error', 'Failed to add currency', 'error');
      }
    });
  }

  deleteCurrency(currency: InvoicingCurrency): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Delete "${currency.value}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.isConfirmed) {
        this.currencyService.delete(currency.id).subscribe({
          next: () => {
            this.currencies = this.currencies.filter(c => c.id !== currency.id);
            this.filterCurrencies();
            Swal.fire('Deleted!', 'Currency deleted.', 'success');
          },
          error: () => {
            Swal.fire('Error', 'Failed to delete currency', 'error');
          }
        });
      }
    });
  }

  filterCurrencies(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.paginatedCurrencies = this.currencies.filter(currency =>
      currency.value.toLowerCase().includes(term)
    );
    this.sortTable(this.sortColumn); // reapply sorting
    this.updatePagination();
  }

  sortTable(column: string): void {
    if (!column) return;

    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.paginatedCurrencies.sort((a, b) => {
      const valueA = a[column as keyof InvoicingCurrency]?.toString().toLowerCase() || '';
      const valueB = b[column as keyof InvoicingCurrency]?.toString().toLowerCase() || '';
      return this.sortDirection === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    });

    this.updatePagination();
  }

  updatePagination(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    const totalItems = this.paginatedCurrencies.length;
    this.totalPages = Math.ceil(totalItems / this.pageSize);
    this.paginatedCurrencies = this.paginatedCurrencies.slice(start, end);
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
