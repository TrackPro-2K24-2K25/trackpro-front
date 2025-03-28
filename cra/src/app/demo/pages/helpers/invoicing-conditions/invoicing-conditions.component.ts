import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';
import { InvoicingConditions } from 'src/app/models/interfaces/invoicing-conditions.interface';
import { PaymentTerm } from 'src/app/models/interfaces/payment-term.interface';
import { PaymentTermService } from 'src/app/services/payment-term.service';
import { InvoicingConditionService } from 'src/app/services/invoicing-condition.service';

@Component({
  selector: 'app-invoicing-conditions',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './invoicing-conditions.component.html',
  styleUrls: ['./invoicing-conditions.component.scss']
})
export class InvoicingConditionsComponent implements AfterViewInit {
  invoicingConditions: InvoicingConditions[] = [];
  paginatedInvoicingConditions: InvoicingConditions[] = [];

  paymentTerms: PaymentTerm[] = [];

  newInvoicingCondition: InvoicingConditions = {
    paymentTerm: {} as PaymentTerm,
    discount: 0,
    daysForDiscount: 0,
    lateFeeRate: 0,
    isActive: true
  };

  searchTerm = '';
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;

  modalInstance: any;

  constructor(
    private paymentTermService: PaymentTermService,
    private invoicingConditionService: InvoicingConditionService
  ) {
    this.loadPaymentTerms();
    this.loadInvoicingConditions();
  }

  loadPaymentTerms() {
    this.paymentTermService.getAll().subscribe({
      next: (response) => {
        this.paymentTerms = response.content;
        console.log('✅ Payment terms loaded:', this.paymentTerms);
      },
      error: (err) => {
        console.error('❌ Failed to load payment terms', err);
        Swal.fire('Error', 'Failed to load payment terms.', 'error');
      }
    });
  }

  loadInvoicingConditions() {
    this.invoicingConditionService.getAll(this.currentPage - 1, this.pageSize).subscribe({
      next: (response) => {
        this.invoicingConditions = response.content;
        this.totalPages = response.totalPages;
        this.updatePagination();
      },
      error: (err) => {
        console.error('❌ Failed to load invoicing conditions', err);
        Swal.fire('Error', 'Failed to load invoicing conditions.', 'error');
      }
    });
  }

  updatePagination() {
    this.paginatedInvoicingConditions = this.invoicingConditions;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadInvoicingConditions();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadInvoicingConditions();
    }
  }

  filterInvoicingConditions() {
    const lower = this.searchTerm.toLowerCase().trim();
    this.paginatedInvoicingConditions = this.invoicingConditions.filter(condition =>
      condition.paymentTerm.value.toLowerCase().includes(lower) ||
      condition.discount.toString().includes(lower) ||
      condition.daysForDiscount.toString().includes(lower) ||
      condition.lateFeeRate.toString().includes(lower) ||
      (condition.isActive ? 'yes' : 'no').includes(lower)
    );
  }

  ngAfterViewInit() {
    const modalElement = document.getElementById('addInvoicingConditionModal');
    if (modalElement) {
      this.modalInstance = new bootstrap.Modal(modalElement);
    }
  }

  addInvoicingCondition() {
    if (
      !this.newInvoicingCondition.paymentTerm?.id ||
      this.newInvoicingCondition.discount < 0 ||
      this.newInvoicingCondition.daysForDiscount < 0 ||
      this.newInvoicingCondition.lateFeeRate < 0
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Input',
        text: 'Please fill all fields correctly before saving!',
        confirmButtonColor: '#d33'
      });
      return;
    }

    this.invoicingConditionService.create(this.newInvoicingCondition).subscribe({
      next: (saved) => {
        this.loadInvoicingConditions(); // Refresh list
        Swal.fire({
          icon: 'success',
          title: 'Added',
          text: 'The invoicing condition was successfully added!',
          confirmButtonColor: '#3085d6'
        });
        this.modalInstance.hide();
      },
      error: (err) => {
        console.error('❌ Failed to save invoicing condition', err);
        Swal.fire('Error', 'Failed to save invoicing condition.', 'error');
      }
    });
  }
}
