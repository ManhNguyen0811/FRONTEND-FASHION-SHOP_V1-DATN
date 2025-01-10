import { Routes } from "@angular/router";
import { AdminComponent } from "./admin.component";
import { UserComponent } from "./user/user.component";
import { ListCategoryComponent } from "./categoty/list-category/list-category.component";
import { EditCategoryComponent } from "./categoty/edit-category/edit-category.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ListOrderComponent } from "./order/list-order/list-order.component";
import { EditOrderComponent } from "./order/edit-order/edit-order.component";
 
export const adminRouter: Routes =[
    {
        path: '',
         component: AdminComponent,
         children:
         [
            {
                path:'user',
                component: UserComponent
            },
            {
                path:'list_category',
                component: ListCategoryComponent
            },
            {
                path:'edit_category/:id',
                component: EditCategoryComponent
            },
            {
                path:'edit_category',
                component: EditCategoryComponent
            },
            {
                path:'dashboard',
                component: DashboardComponent
            },
            {
                path:'list_order',
                component: ListOrderComponent
            },
            {
                path:'edit_order',
                component: EditOrderComponent
            }
         ]
    }
]