import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-payment-terms',
  standalone: true,
  imports: [CommonModule, FormsModule ,CardComponent],
  templateUrl: './payment-terms.component.html',
  styleUrls: ['./payment-terms.component.scss']
})
export class PaymentTermsComponent {
  paymentTerms = [
    { value: 'Net 30', description: 'Payment due in 30 days', days: 30, isDefault: false, isActive: true },
    { value: 'Net 60', description: 'Payment due in 60 days', days: 60, isDefault: false, isActive: true },
    { value: 'Net 90', description: 'Payment due in 90 days', days: 90, isDefault: false, isActive: false }
  ];

  newPaymentTerm = { value: '', description: '', days: 0, isDefault: false, isActive: true };
  selectedPaymentTerm: any = null;
  searchTerm = '';
  paginatedPaymentTerms = [...this.paymentTerms];
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
    this.totalPages = Math.ceil(this.paginatedPaymentTerms.length / this.pageSize);
    this.paginatedPaymentTerms = this.paginatedPaymentTerms.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
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

    this.paginatedPaymentTerms.sort((a, b) => {
      let valueA = a[column].toString().toLowerCase();
      let valueB = b[column].toString().toLowerCase();

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.updatePagination();
  }

  filterPaymentTerms() {
    const lowerCaseSearch = this.searchTerm.toLowerCase().trim();
    this.paginatedPaymentTerms = this.paymentTerms.filter(term =>
      Object.values(term).some(value =>
        value.toString().toLowerCase().includes(lowerCaseSearch)
      )
    );
    this.updatePagination();
  }

  ngAfterViewInit() {
    const modalElement = document.getElementById('addPaymentTermModal');
    if (modalElement) {
      this.modalInstance = new bootstrap.Modal(modalElement);
    }
  }

  addPaymentTerm() {
    if (!this.newPaymentTerm.value || !this.newPaymentTerm.description || this.newPaymentTerm.days <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Fields',
        text: 'Please fill all fields before saving!',
        confirmButtonColor: '#d33'
      });
      return;
    }
    this.paymentTerms.push({ ...this.newPaymentTerm });
    this.newPaymentTerm = { value: '', description: '', days: 0, isDefault: false, isActive: true };
    this.updatePagination();
    Swal.fire({
      icon: 'success',
      title: 'Payment Term Added',
      text: 'The payment term has been successfully added!',
      confirmButtonColor: '#3085d6'
    });
    this.modalInstance.hide();
  }

  editPaymentTerm(term: any) {
    this.selectedPaymentTerm = { ...term };
    const modalElement = document.getElementById('editPaymentTermModal');
    if (modalElement) {
      this.modalInstance = new bootstrap.Modal(modalElement);
      this.modalInstance.show();
    }
  }

  updatePaymentTerm() {
    const index = this.paymentTerms.findIndex(term => term.value === this.selectedPaymentTerm.value);
    if (index !== -1) {
      this.paymentTerms[index] = { ...this.selectedPaymentTerm };
    }
    this.updatePagination();
    Swal.fire({
      icon: 'success',
      title: 'Payment Term Updated',
      text: 'The payment term has been successfully updated!',
      confirmButtonColor: '#3085d6'
    });
    this.modalInstance.hide();
  }
}
