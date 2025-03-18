import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

// Import CardComponent (if required)
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';

// Import Ant Design Icon Module
import { IconDirective } from '@ant-design/icons-angular';
import { IconService } from '@ant-design/icons-angular';
import { PlusOutline } from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-sample-page',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './sample-page.component.html',
  styleUrls: ['./sample-page.component.scss']
})

export class SamplePageComponent {
  users = [
    { firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com', username: 'alice01', role: 'Admin' },
    { firstName: 'Bob', lastName: 'Brown', email: 'bob@example.com', username: 'bob02', role: 'User' },
    { firstName: 'Charlie', lastName: 'Davis', email: 'charlie@example.com', username: 'charlie03', role: 'Editor' },
    { firstName: 'David', lastName: 'Evans', email: 'david@example.com', username: 'david04', role: 'User' },
    { firstName: 'Emma', lastName: 'Fisher', email: 'emma@example.com', username: 'emma05', role: 'Admin' },
    { firstName: 'Frank', lastName: 'Garcia', email: 'frank@example.com', username: 'frank06', role: 'User' },
    { firstName: 'Grace', lastName: 'Harris', email: 'grace@example.com', username: 'grace07', role: 'Editor' },
    { firstName: 'Henry', lastName: 'Irwin', email: 'henry@example.com', username: 'henry08', role: 'User' },
    { firstName: 'Isabella', lastName: 'Jones', email: 'isabella@example.com', username: 'isabella09', role: 'Admin' },
    { firstName: 'Jack', lastName: 'Kelly', email: 'jack@example.com', username: 'jack10', role: 'User' }
  ];

  paginatedUsers = [];
  searchTerm = '';
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private iconService: IconService) {
    this.iconService.addIcon(PlusOutline); // ✅ Register Plus Icon
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.users.length / this.pageSize);
    this.paginatedUsers = this.users.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
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

    this.users.sort((a, b) => {
      let valueA = a[column].toString().toLowerCase();
      let valueB = b[column].toString().toLowerCase();

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.updatePagination();
  }

  getSortArrow(column: string) {
    if (this.sortColumn === column) {
      return this.sortDirection === 'asc' ? '⬆️' : '⬇️';
    }
    return '↕️';
  }

  filterUsers() {
    let filtered = this.users.filter(user =>
      Object.values(user).some(value =>
        value.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );
    this.users = filtered;
    this.updatePagination();
  }

  editUser(user) {
    console.log('Editing user:', user);
  }

  deleteUser(userId) {
    console.log('Deleting user with ID:', userId);
  }

  
}
