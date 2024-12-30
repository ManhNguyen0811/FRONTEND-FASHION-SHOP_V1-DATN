import { Routes } from "@angular/router";
import { AdminComponent } from "./admin.component";
import { UserComponent } from "./user/user.component";
import { CategoryComponent } from "./category/category.component";
 
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
                path:'category',
                component: CategoryComponent
            }
         ]
    }
]