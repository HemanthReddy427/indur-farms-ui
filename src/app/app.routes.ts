import { Routes } from '@angular/router';

import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { CartComponent } from './features/cart/cart.component';
import { AdminLayoutComponent } from './features/admin/admin-layout/admin-layout.component';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { AddProductComponent } from './features/admin/products/add-product/add-product.component';
import { EditProductComponent } from './features/admin/products/edit-product/edit-product.component';
import { authGuard } from './Guards/auth.guard';
import { adminGuard } from './Guards/admin.guard';
import { ProductListAdminComponent } from './features/admin/products/product-list/product-list.component';
import { ProductListComponent } from './features/products/product-list/product-list.component';
import { ProductDetailsComponent } from './features/products/product-details/product-details.component';
import { AddressListComponent } from './features/Address/address-list/address-list.component';
import { AddAddressComponent } from './features/Address/add-address/add-address.component';
import { EditAddressComponent } from './features/Address/edit-address/edit-address.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { OrderSuccessComponent } from './features/orders/order-success/order-success.component';
import { MyOrdersComponent } from './features/orders/my-orders/my-orders.component';

export const routes: Routes = [

  {
    path: '',
    component: HomeComponent
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'register',
    component: RegisterComponent
  },

  {
    path: 'products',
    component: ProductListComponent
  },

  {
    path: 'cart',
    component: CartComponent,
    canActivate: [authGuard]
  },
  {
    path: 'products/:id',
    component: ProductDetailsComponent
},
{
    path:'addresses',
    component:AddressListComponent
},
{
    path:'addresses/add',
    component:AddAddressComponent
},
{
    path:'addresses/edit/:id',
    component:EditAddressComponent
},
{
    path:'order-success/:id',

    component:OrderSuccessComponent,

    canActivate:[authGuard]
},
{
    path: 'orders',
    component: MyOrdersComponent,
    canActivate: [authGuard]
},
 {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [authGuard] 
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [

      {
        path: '',
        component: DashboardComponent
      },

      {
        path: 'products',
        component: ProductListAdminComponent
      },

      {
        path: 'products/add',
        component: AddProductComponent
      },

      {
        path: 'products/edit/:id',
        component: EditProductComponent
      }

    ]
  },

  {
    path: '**',
    redirectTo: ''
  }

];