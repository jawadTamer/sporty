import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./pages/auth/signup/signup.component').then(
        (m) => m.SignupComponent
      ),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./pages/products/products.component').then(
        (m) => m.ProductsComponent
      ),
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./pages/product-details/product-details.component').then(
        (m) => m.ProductDetailsComponent
      ),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/dashboard/overview/overview.component').then(
            (m) => m.OverviewComponent
          ),
      },
      {
        path: 'add-product',
        loadComponent: () =>
          import('./pages/dashboard/add-product/add-product.component').then(
            (m) => m.AddProductComponent
          ),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./pages/dashboard/products/products.component').then(
            (m) => m.ProductsComponent
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
