import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-creation-modal',
  templateUrl: './user-creation-modal.component.html',
  styleUrls: ['./user-creation-modal.component.scss']
})
export class UserCreationModalComponent implements OnInit {
  currentStep: number = 1;
  totalSteps: number = 5;

  requiredFieldsByStep: { [key: number]: string[] } = {
    1: ['firstName', 'lastName', 'email', 'username', 'role'],
    2: ['phoneNumber'],
    3: ['streetAddress', 'city', 'state', 'postalCode', 'country'],
    4: []
  };

  ngOnInit(): void {
    this.updateUI();
  }

  nextStep(): void {
    if (this.validateCurrentStep()) {
      this.currentStep++;
      this.updateUI();
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateUI();
    }
  }

  updateUI(): void {
    const steps = document.querySelectorAll('.form-step');
    steps.forEach((step) => step.classList.remove('active'));
    const currentStepContent = document.querySelector(`.step-${this.currentStep}-content`);
    if (currentStepContent) currentStepContent.classList.add('active');

    document.querySelectorAll('.step-item').forEach(item => item.classList.remove('active'));
    const currentStepIndicator = document.querySelector(`.step-${this.currentStep}`);
    if (currentStepIndicator) currentStepIndicator.classList.add('active');

    (document.getElementById('prevBtn') as HTMLElement).style.display = this.currentStep > 1 ? 'inline-block' : 'none';
    (document.getElementById('nextBtn') as HTMLElement).style.display = this.currentStep < this.totalSteps ? 'inline-block' : 'none';
    (document.getElementById('createBtn') as HTMLElement).style.display = this.currentStep === this.totalSteps ? 'inline-block' : 'none';

    if (this.currentStep === this.totalSteps) {
      this.updateSummary();
    }
  }

  validateCurrentStep(): boolean {
    const stepFields = this.requiredFieldsByStep[this.currentStep];
    let isValid = true;

    stepFields?.forEach((fieldId) => {
      const field = document.getElementById(fieldId) as HTMLInputElement;
      if (field && field.required && !field.value.trim()) {
        field.classList.add('is-invalid');
        isValid = false;
      } else {
        field?.classList.remove('is-invalid');
      }
    });

    return isValid;
  }

  updateSummary(): void {
    const formData: { [key: string]: string } = {};

    const inputs = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
      '#userForm input, #userForm textarea, #userForm select'
    );

    inputs.forEach((input) => {
      formData[input.id] = input.value;
    });

    Object.entries(formData).forEach(([key, value]) => {
      const summaryElement = document.getElementById(`summary-${key}`);
      if (summaryElement) {
        summaryElement.textContent = value || 'Non spécifié';
      }
    });
  }

  createUser(): void {
    const userData: { [key: string]: string } = {};
    const inputs = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
      '#userForm input, #userForm textarea, #userForm select'
    );

    inputs.forEach((input) => {
      userData[input.id] = input.value;
    });

    console.log('✅ User created:', userData);
    alert('Utilisateur créé avec succès!');
  }
}
