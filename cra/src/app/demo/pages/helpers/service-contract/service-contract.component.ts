import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';

import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { ServiceContract } from 'src/app/models/interfaces/service-contract.interface';
import { ServiceContractService } from 'src/app/services/service-contract.service';

@Component({
  selector: 'app-service-contract',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './service-contract.component.html',
  styleUrl: './service-contract.component.scss'
})
export class ServiceContractComponent implements OnInit {
  serviceContracts: ServiceContract[] = [];
  paginatedServiceContracts: ServiceContract[] = [];

  newServiceContract: Partial<ServiceContract> = { name: '', description: '' };
  selectedServiceContract: ServiceContract | null = null;

  searchTerm = '';
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;

  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  modalInstance: any;

  constructor(private contractService: ServiceContractService) {}

  ngOnInit(): void {
    this.loadServiceContracts();
  }

  ngAfterViewInit() {
    const modalElement = document.getElementById('addServiceContractModal');
    if (modalElement) {
      this.modalInstance = new bootstrap.Modal(modalElement);
    }
  }

  loadServiceContracts(): void {
    this.contractService.getAll().subscribe({
      next: (contracts) => {
        this.serviceContracts = contracts;
        this.filterServiceContracts();
      },
      error: () => {
        Swal.fire('Error', 'Failed to load service contracts.', 'error');
      }
    });
  }

  addServiceContract(): void {
    if (!this.newServiceContract.name || !this.newServiceContract.description) {
      Swal.fire('Missing Fields', 'Please fill all fields before saving!', 'error');
      return;
    }

    this.contractService.create(this.newServiceContract).subscribe({
      next: (created) => {
        this.serviceContracts.push(created);
        this.filterServiceContracts();
        this.newServiceContract = { name: '', description: '' };
        Swal.fire('Success', 'Service contract added!', 'success');
        this.modalInstance.hide();
      },
      error: () => {
        Swal.fire('Error', 'Failed to create service contract.', 'error');
      }
    });
  }

  editServiceContract(contract: ServiceContract): void {
    this.selectedServiceContract = { ...contract };
    const modalElement = document.getElementById('editServiceContractModal');
    if (modalElement) {
      this.modalInstance = new bootstrap.Modal(modalElement);
      this.modalInstance.show();
    }
  }

  updateServiceContract(): void {
    if (!this.selectedServiceContract) return;

    this.contractService.update(this.selectedServiceContract.id, this.selectedServiceContract).subscribe({
      next: (updated) => {
        const index = this.serviceContracts.findIndex(c => c.id === updated.id);
        if (index !== -1) {
          this.serviceContracts[index] = updated;
          this.filterServiceContracts();
        }
        Swal.fire('Success', 'Service contract updated!', 'success');
        this.modalInstance.hide();
      },
      error: () => {
        Swal.fire('Error', 'Failed to update service contract.', 'error');
      }
    });
  }

  deleteServiceContract(contract: ServiceContract): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Delete ${contract.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.isConfirmed) {
        this.contractService.delete(contract.id).subscribe({
          next: () => {
            this.serviceContracts = this.serviceContracts.filter(c => c.id !== contract.id);
            this.filterServiceContracts();
            Swal.fire('Deleted!', 'Service contract deleted.', 'success');
          },
          error: () => {
            Swal.fire('Error', 'Failed to delete service contract.', 'error');
          }
        });
      }
    });
  }

  filterServiceContracts(): void {
    const lowerSearch = this.searchTerm.toLowerCase().trim();
    const filtered = this.serviceContracts.filter(contract =>
      contract.name.toLowerCase().includes(lowerSearch) ||
      contract.description.toLowerCase().includes(lowerSearch)
    );
    this.paginatedServiceContracts = [...filtered];
    this.sortTable(this.sortColumn); // reapply sort
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

    this.paginatedServiceContracts.sort((a, b) => {
      const valueA = a[column as keyof ServiceContract]?.toString().toLowerCase() || '';
      const valueB = b[column as keyof ServiceContract]?.toString().toLowerCase() || '';
      return this.sortDirection === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    });

    this.updatePagination();
  }

  updatePagination(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    const totalItems = this.paginatedServiceContracts.length;
    this.totalPages = Math.ceil(totalItems / this.pageSize);
    this.paginatedServiceContracts = this.paginatedServiceContracts.slice(start, end);
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
