export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  groupClasses?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: NavigationItem[];
  link?: string;
  description?: string;
  path?: string;
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'default',
        title: 'Statistics',
        type: 'item',
        classes: 'nav-item',
        url: '/dashboard/default',
        icon: 'dashboard',
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'authentication',
    title: 'Authentication',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'login',
        title: 'Login',
        type: 'item',
        classes: 'nav-item',
        url: '/login',
        icon: 'login',
        target: true,
        breadcrumbs: false
      },
      {
        id: 'register',
        title: 'Register',
        type: 'item',
        classes: 'nav-item',
        url: '/register',
        icon: 'profile',
        target: true,
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'other',
    title: 'Other',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'sample-page',
        title: 'Users',
        type: 'item',
        url: '/users',
        classes: 'nav-item',
        icon: 'chrome'
      },
      {
        id: 'document',
        title: 'Companies',
        type: 'item',
        classes: 'nav-item',
        url: '/companies',
        icon: 'chrome'
      },
      {
        id: 'document',
        title: 'Bank Accounts',
        type: 'item',
        classes: 'nav-item',
        url: '/bank-accounts',
        icon: 'chrome'
      },
    
      
      {
        id: 'document',
        title: 'Missions',
        type: 'item',
        classes: 'nav-item',
        url: '/missions',
        icon: 'chrome'
      },
      {
        id: 'document',
        title: 'Timesheets',
        type: 'item',
        classes: 'nav-item',
        url: '/timesheets',
        icon: 'chrome'
      }
    ]
  },
  {
    id: 'utilities',
    title: 'Helpers',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'tabler',
        title: 'Payment Terms',
        type: 'item',
        classes: 'nav-item',
        url: '/payment-terms',
        icon: 'profile'
      },
      {
        id: 'typography',
        title: 'Invoicing Conditions',
        type: 'item',
        classes: 'nav-item',
        url: '/invoicing-conditions',
        icon: 'profile'
      },
      {
        id: 'color',
        title: 'Invoicing Currency',
        type: 'item',
        classes: 'nav-item',
        url: '/invoicing-currency',
        icon: 'profile'
      },
      
      {
        id: 'tabler',
        title: 'Service Contract',
        type: 'item',
        classes: 'nav-item',
        url: '/service-contract',
        icon: 'profile'
      }
    ]
  }

 
];
