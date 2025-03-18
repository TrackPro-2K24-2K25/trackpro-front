import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';


@Component({
  selector: 'app-service-contract',
  standalone: true,
  imports: [CommonModule, FormsModule ,CardComponent],
  templateUrl: './service-contract.component.html',
  styleUrl: './service-contract.component.scss'
})

export class ServiceContractComponent {
  serviceContracts = [
    { id: '1', name: 'Contract A', description: 'Service contract for maintenance' },
    { id: '2', name: 'Contract B', description: 'Service contract for repairs' },
    { id: '3', name: 'Contract C', description: 'Annual service agreement' }
  ];

  newServiceContract = { name: '', description: '' };
  selectedServiceContract: any = null;
  searchTerm = '';
  paginatedServiceContracts = [...this.serviceContracts];
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
    this.totalPages = Math.ceil(this.paginatedServiceContracts.length / this.pageSize);
    this.paginatedServiceContracts = this.paginatedServiceContracts.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
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

    this.paginatedServiceContracts.sort((a, b) => {
      let valueA = a[column].toString().toLowerCase();
      let valueB = b[column].toString().toLowerCase();

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.updatePagination();
  }

  filterServiceContracts() {
    const lowerCaseSearch = this.searchTerm.toLowerCase().trim();
    this.paginatedServiceContracts = this.serviceContracts.filter(contract =>
      Object.values(contract).some(value =>
        value.toString().toLowerCase().includes(lowerCaseSearch)
      )
    );
    this.updatePagination();
  }

  ngAfterViewInit() {
    const modalElement = document.getElementById('addServiceContractModal');
    if (modalElement) {
      this.modalInstance = new bootstrap.Modal(modalElement);
    }
  }

  addServiceContract() {
    if (!this.newServiceContract.name || !this.newServiceContract.description) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Fields',
        text: 'Please fill all fields before saving!',
        confirmButtonColor: '#d33'
      });
      return;
    }
    this.serviceContracts.push({ ...this.newServiceContract, id: (this.serviceContracts.length + 1).toString() });
    this.newServiceContract = { name: '', description: '' };
    this.updatePagination();
    Swal.fire({
      icon: 'success',
      title: 'Service Contract Added',
      text: 'The service contract has been successfully added!',
      confirmButtonColor: '#3085d6'
    });
    this.modalInstance.hide();
  }

  editServiceContract(contract: any) {
    this.selectedServiceContract = { ...contract };
    const modalElement = document.getElementById('editServiceContractModal');
    if (modalElement) {
      this.modalInstance = new bootstrap.Modal(modalElement);
      this.modalInstance.show();
    }
  }

  updateServiceContract() {
    const index = this.serviceContracts.findIndex(contract => contract.id === this.selectedServiceContract.id);
    if (index !== -1) {
      this.serviceContracts[index] = { ...this.selectedServiceContract };
    }
    this.updatePagination();
    Swal.fire({
      icon: 'success',
      title: 'Service Contract Updated',
      text: 'The service contract has been successfully updated!',
      confirmButtonColor: '#3085d6'
    });
    this.modalInstance.hide();
  }
}
