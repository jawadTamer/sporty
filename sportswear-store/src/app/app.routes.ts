import { Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import { AdminGuard } from './services/admin.guard';

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
    canActivate: [AdminGuard],
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
      {
        path: 'users',
        loadComponent: () =>
          import('./pages/dashboard/users/users.component').then(
            (m) => m.UsersComponent
          ),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./pages/dashboard/orders/orders.component').then(
            (m) => m.OrdersComponent
          ),
      },
    ],
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./pages/cart/cart.component').then((m) => m.CartComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./pages/about/about.component').then((m) => m.AboutComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
