// angular import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Project import
import { AdminComponent } from './theme/layouts/admin-layout/admin-layout.component';
import { GuestLayoutComponent } from './theme/layouts/guest-layout/guest-layout.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: '/dashboard/default',
        pathMatch: 'full'
      },
      {
        path: 'dashboard/default',
        loadComponent: () => import('./demo/dashboard/default/default.component').then((c) => c.DefaultComponent)
      },
      {
        path: 'typography',
        loadComponent: () => import('./demo/component/basic-component/color/color.component').then((c) => c.ColorComponent)
      },
      {
        path: 'color',
        loadComponent: () => import('./demo/component/basic-component/typography/typography.component').then((c) => c.TypographyComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./demo/others/sample-page/sample-page.component').then((c) => c.SamplePageComponent)
      },
      {
        path: 'bank-accounts',  
        loadComponent: () => import('./demo/others/bank-accounts/bank-accounts.component').then((c) => c.BankAccountsComponent)
      },
      {
        path: 'invoicing-conditions',  
        loadComponent: () => import('./demo/pages/helpers/invoicing-conditions/invoicing-conditions.component').then((c) => c.InvoicingConditionsComponent)
      },
      {
        path: 'invoicing-currency',  
        loadComponent: () => import('./demo/pages/helpers/invoicing-currency/invoicing-currency.component').then((c) => c.InvoicingCurrencyComponent)
      },
      {
        path: 'payment-terms',  
        loadComponent: () => import('./demo/pages/helpers/payment-terms/payment-terms.component').then((c) => c.PaymentTermsComponent)
      },
      {
        path: 'service-contract',  
        loadComponent: () => import('./demo/pages/helpers/service-contract/service-contract.component').then((c) => c.ServiceContractComponent)
      },
      {
        path: 'timesheets',  
        loadComponent: () => import('./demo/others/timesheets/timesheets.component').then((c) => c.TimesheetsComponent)
      },
      {
        path: 'companies',  
        loadComponent: () => import('./demo/others/companies/companies.component').then((c) => c.CompaniesComponent)
      },
      {
        path: 'missions',  
        loadComponent: () => import('./demo/others/missions/missions.component').then((c) => c.MissionsComponent)
      }
    ]
  },
  {
    path: '',
    component: GuestLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./demo/pages/authentication/auth-login/auth-login.component').then((c) => c.AuthLoginComponent)
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./demo/pages/authentication/auth-register/auth-register.component').then((c) => c.AuthRegisterComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
