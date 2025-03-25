import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { PaymentTerm } from 'src/app/models/interfaces/payment-term.interface';
import { PaymentTermService } from 'src/app/services/payment-term.service';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-payment-terms',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './payment-terms.component.html',
  styleUrls: ['./payment-terms.component.scss']
})
export class PaymentTermsComponent implements OnInit {
  paymentTerms: PaymentTerm[] = [];
  paginatedPaymentTerms: PaymentTerm[] = [];
  selectedPaymentTerm: PaymentTerm | null = null;
  editModalInstance: any;


  newPaymentTerm: PaymentTerm = {
    id: '',
    value: '',
    description: '',
    days: 0,
    default: false,
    active: true
  };

  searchTerm = '';
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  modalInstance: any;

  constructor(private paymentTermService: PaymentTermService) {}

  ngOnInit(): void {
    this.loadPaymentTerms();
  }

  loadPaymentTerms(): void {
    this.paymentTermService.getAll().subscribe({
      next: (data: any) => {
        this.paymentTerms = data.content || data;
        this.applyFilters();
      },
      error: err => {
        console.error('❌ Error loading payment terms:', err);
      }
    });
  }

  addPaymentTerm(): void {
    if (!this.newPaymentTerm.value || !this.newPaymentTerm.description || this.newPaymentTerm.days <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Fields',
        text: 'Please fill all fields before saving!',
        confirmButtonColor: '#d33'
      });
      return;
    }

    this.paymentTermService.create(this.newPaymentTerm).subscribe({
      next: created => {
        this.paymentTerms.push(created);
        this.applyFilters();
        this.resetForm();
        Swal.fire({
          icon: 'success',
          title: 'Payment Term Added',
          confirmButtonColor: '#3085d6'
        });
        this.modalInstance?.hide();
      },
      error: err => {
        console.error('❌ Failed to save:', err);
        Swal.fire({
          icon: 'error',
          title: 'Save Failed',
          text: 'Something went wrong while saving the payment term.'
        });
      }
    });
  }

  deletePaymentTerm(id: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete the payment term permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.isConfirmed) {
        this.paymentTermService.delete(id).subscribe({
          next: () => {
            this.paymentTerms = this.paymentTerms.filter(term => term.id !== id);
            this.applyFilters();
            Swal.fire('Deleted!', 'The payment term has been deleted.', 'success');
          },
          error: err => {
            console.error('❌ Failed to delete:', err);
            Swal.fire('Error', 'Failed to delete the payment term.', 'error');
          }
        });
      }
    });
  }

  editPaymentTerm(term: PaymentTerm): void {
    this.selectedPaymentTerm = { ...term };
    const modalEl = document.getElementById('editPaymentTermModal');
    if (modalEl) {
      this.editModalInstance = new bootstrap.Modal(modalEl);
      this.editModalInstance.show();
    }
  }

  updatePaymentTerm() {
    if (!this.selectedPaymentTerm) return;
  
    const updatedTerm: PaymentTerm = {
      id: this.selectedPaymentTerm.id,
      value: this.selectedPaymentTerm.value,
      description: this.selectedPaymentTerm.description,
      days: this.selectedPaymentTerm.days,
      default: this.selectedPaymentTerm.default,
      active: this.selectedPaymentTerm.active,
      invoicingConditions: [] // ✅ Required by backend
    };
  
    this.paymentTermService.update(this.selectedPaymentTerm.id, updatedTerm).subscribe({
      next: () => {
        Swal.fire('Updated!', 'Payment term updated successfully.', 'success');
        this.loadPaymentTerms();
        this.modalInstance.hide();
      },
      error: (err) => {
        console.error('❌ Error updating term:', err);
        Swal.fire('Error', 'Failed to update payment term.', 'error');
      }
    });
  }
  
  
  
  

  sortTable(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.paymentTerms.sort((a, b) => {
      const valA = (a as any)[column]?.toString().toLowerCase() || '';
      const valB = (b as any)[column]?.toString().toLowerCase() || '';

      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.applyFilters();
  }

  filterPaymentTerms(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    const term = this.searchTerm.toLowerCase().trim();
    const filtered = this.paymentTerms.filter(item =>
      Object.values(item).some(value =>
        value?.toString().toLowerCase().includes(term)
      )
    );
    this.totalPages = Math.ceil(filtered.length / this.pageSize);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedPaymentTerms = filtered.slice(start, end);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.applyFilters();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyFilters();
    }
  }

  resetForm(): void {
    this.newPaymentTerm = {
      id: '',
      value: '',
      description: '',
      days: 0,
      default: false,
      active: true
    };
  }

  ngAfterViewInit(): void {
    const modalEl = document.getElementById('addPaymentTermModal');
    if (modalEl) {
      this.modalInstance = new bootstrap.Modal(modalEl);
    }
  }
}
