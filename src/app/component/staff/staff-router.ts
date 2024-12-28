import { Routes } from "@angular/router";
import { StaffComponent } from "./staff.component";
import { TestStaffComponent } from "./test-staff/test-staff.component";
 
 
export const staffRouter: Routes =[
    {
        path: '',
         component: StaffComponent,
         children:
         [
            {
                path: "testStaff",
                component: TestStaffComponent
               
            }
         ]
    }
]