import { Routes } from "@angular/router";
import { AdminComponent } from "./admin.component";
import { UserComponent } from "./user/user.component";
import { ListCategoryComponent } from "./categoty/list-category/list-category.component";
import { EditCategoryComponent } from "./categoty/edit-category/edit-category.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
 
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
            }
         ]
    }
]