import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./pages/home/home.component").then((m) => m.HomeComponent),
  },
  {
    path: "products",
    loadComponent: () =>
      import("./pages/products/products.component").then(
        (m) => m.ProductsComponent
      ),
  },
  {
    path: "product/:id",
    loadComponent: () =>
      import("./pages/product-detail/product-detail.component").then(
        (m) => m.ProductDetailComponent
      ),
  },
  {
    path: "cart",
    loadComponent: () =>
      import("./pages/cart/cart.component").then((m) => m.CartComponent),
  },
  {
    path: "login",
    loadComponent: () =>
      import("./pages/auth/login/login.component").then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: "register",
    loadComponent: () =>
      import("./pages/auth/register/register.component").then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: "profile",
    loadComponent: () =>
      import("./pages/profile/profile.component").then(
        (m) => m.ProfileComponent
      ),
  },
  {
    path: "**",
    redirectTo: "",
  },
];
