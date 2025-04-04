import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { IconService } from '@ant-design/icons-angular';
import { PlusOutline } from '@ant-design/icons-angular/icons';
import { AppUser } from 'src/app/models/interfaces/user.interface';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sample-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardComponent],
  templateUrl: './sample-page.component.html',
  styleUrls: ['./sample-page.component.scss']
})
export class SamplePageComponent implements OnInit {
  users: AppUser[] = [];
  paginatedUsers: AppUser[] = [];

  // Pagination
  searchTerm = '';
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;

  // Sorting
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Form & Modal
  userForm!: FormGroup;
  currentStep = 1;
  summaryKeys: string[] = [];

  constructor(
    private iconService: IconService,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.iconService.addIcon(PlusOutline);
  }

  ngOnInit(): void {
    this.initForm();
    this.loadUsers();
  }

  // Initialize reactive form
  initForm(): void {
    this.userForm = this.fb.group({
      // Step 1
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required],

      // Step 2
      phoneNumber: ['', Validators.required],
      alternativeEmail: [''],

      // Step 3
      streetAddress: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],

      // Step 4
      gender: [''],
      dateOfBirth: [''],
      website: [''],
      bio: ['']
    });
  }

  // Load user list
  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        this.users = response.content;
        this.updatePagination();
      },
      error: (err) => {
        console.error('❌ Error loading users:', err);
      }
    });
  }

  // Pagination
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

  // Sorting
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
      return this.sortDirection === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });

    this.updatePagination();
  }

  // User Actions
  editUser(user: AppUser): void {
    console.log('Edit user:', user);
  }

  deleteUser(id: string): void {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.users = this.users.filter(user => user.id !== id);
        this.updatePagination();
      },
      error: (err) => {
        console.error('❌ Failed to delete user:', err);
      }
    });
  }

  // Step Navigation
  nextStep(): void {
    if (this.validateCurrentStep()) {
      this.currentStep++;
      this.updateSummaryKeys();
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  validateCurrentStep(): boolean {
    const controlsPerStep: { [key: number]: string[] } = {
      1: ['firstName', 'lastName', 'email', 'username', 'password', 'role'],
      2: ['phoneNumber'],
      3: ['streetAddress', 'city', 'state', 'country'],
      4: [],
    };

    const controls = controlsPerStep[this.currentStep];
    let isValid = true;

    controls.forEach(controlName => {
      const control = this.userForm.get(controlName);
      control?.markAsTouched();
      if (control?.invalid) isValid = false;
    });

    return isValid;
  }

  updateSummaryKeys(): void {
    this.summaryKeys = Object.keys(this.userForm.value);
  }

  submitUser(): void {
    if (this.userForm.valid) {
      const newUser = this.userForm.value;
      console.log('✅ Submitted user:', newUser);

      // Submit to backend if needed
      this.userService.createUser(newUser).subscribe({
        next: (createdUser) => {
          alert('Utilisateur créé avec succès!');
          this.users.push(createdUser);
          this.updatePagination();
          this.resetForm();
        },
        error: (err) => {
          console.error('❌ Error creating user:', err);
        }
      });
    }
  }

  resetForm(): void {
    this.userForm.reset();
    this.currentStep = 1;
  }

  totalSteps = 5;

  get progressPercentage(): number {
    return ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
  }
  
}
