import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { IconDirective } from '@ant-design/icons-angular';
import { IconService } from '@ant-design/icons-angular';
import { PlusOutline } from '@ant-design/icons-angular/icons';
import { AppUser } from 'src/app/models/interfaces/user.interface';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sample-page',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './sample-page.component.html',
  styleUrls: ['./sample-page.component.scss']
})
export class SamplePageComponent implements OnInit {
  users: AppUser[] = [];
  paginatedUsers: AppUser[] = [];

  searchTerm = '';
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;

  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private iconService: IconService, private userService: UserService) {
    this.iconService.addIcon(PlusOutline);
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        console.log('✅ Loaded users:', response.content);
        this.users = response.content;
        this.updatePagination();
      },
      error: (err) => {
        console.error('❌ Error loading users:', err);
      }
    });
  }
  
  

  updatePagination(): void {
    this.totalPages = Math.ceil(this.users.length / this.pageSize);
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedUsers = this.users.slice(start, end);
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

  sortTable(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.users.sort((a, b) => {
      const valueA = a[column]?.toString().toLowerCase() ?? '';
      const valueB = b[column]?.toString().toLowerCase() ?? '';
      return this.sortDirection === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    });

    this.updatePagination();
  }

  editUser(user: AppUser): void {
    console.log('Edit user:', user);
    // Navigate to edit form or open modal
  }

  deleteUser(id: string): void {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.users = this.users.filter(user => user.id !== id);
        this.updatePagination();
      },
      error: (err) => {
        console.error('Failed to delete user:', err);
      }
    });
  }
}
