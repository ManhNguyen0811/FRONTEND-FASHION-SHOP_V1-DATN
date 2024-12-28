    import { Routes } from '@angular/router';

    export const routes: Routes = 
    [
        {
            path: 'client',
            loadChildren: () => import('../app/component/client/client-router').then(m => m.clientRouter)
        },
        {
            path: 'admin',
            loadChildren: () => import('../app/component/admin/admin-router').then(m => m.adminRouter)
        },
    
    ];
