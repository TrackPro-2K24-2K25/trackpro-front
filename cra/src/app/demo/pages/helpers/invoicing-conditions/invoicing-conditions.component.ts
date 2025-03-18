import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-invoicing-conditions',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './invoicing-conditions.component.html',
  styleUrls: ['./invoicing-conditions.component.scss']
})
export class InvoicingConditionsComponent {
  invoicingConditions = [
    { paymentTerm: 'Net 30', discount: 2, daysForDiscount: 10, lateFeeRate: 1.5, isActive: true },
    { paymentTerm: 'Net 60', discount: 3, daysForDiscount: 15, lateFeeRate: 2.0, isActive: false }
  ];

  paymentTerms = ['Net 30', 'Net 60', 'Net 90']; // List of available payment terms

  newInvoicingCondition = {
    paymentTerm: '',
    discount: null, // Discount percentage for early payment (e.g., 2%)
    daysForDiscount: null, // Number of days to receive the discount (e.g., 10 days)
    lateFeeRate: null, // Late fee rate (e.g., 1.5% per month)
    isActive: true
  };
  
  
  searchTerm = '';
  paginatedInvoicingConditions = [...this.invoicingConditions];
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  modalInstance: any;

  constructor() {
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.paginatedInvoicingConditions.length / this.pageSize);
    this.paginatedInvoicingConditions = this.paginatedInvoicingConditions.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
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

  filterInvoicingConditions() {
    const lowerCaseSearch = this.searchTerm.toLowerCase().trim();
    this.paginatedInvoicingConditions = this.invoicingConditions.filter(condition =>
      Object.values(condition).some(value =>
        value.toString().toLowerCase().includes(lowerCaseSearch)
      )
    );
    this.updatePagination();
  }

  ngAfterViewInit() {
    const modalElement = document.getElementById('addInvoicingConditionModal');
    if (modalElement) {
      this.modalInstance = new bootstrap.Modal(modalElement);
    }
  }

  addInvoicingCondition() {
    if (!this.newInvoicingCondition.paymentTerm.trim() || this.newInvoicingCondition.discount < 0 || this.newInvoicingCondition.daysForDiscount < 0 || this.newInvoicingCondition.lateFeeRate < 0) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Input',
        text: 'Please fill all fields correctly before saving!',
        confirmButtonColor: '#d33'
      });
      return;
    }
    this.invoicingConditions.push({ ...this.newInvoicingCondition });
    this.newInvoicingCondition = {
      paymentTerm: '',
      discount: 0, // Reset discount percentage
      daysForDiscount: 0, // Reset days for discount
      lateFeeRate: 0, // Reset late fee rate
      isActive: true
    };
    this.updatePagination();
    Swal.fire({
      icon: 'success',
      title: 'Invoicing Condition Added',
      text: 'The invoicing condition has been successfully added!',
      confirmButtonColor: '#3085d6'
    });
    this.modalInstance.hide();
  }
}
