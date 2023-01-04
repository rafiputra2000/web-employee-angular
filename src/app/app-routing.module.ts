import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteGuard } from './shared/guard/root.guard';
import { DashboardComponent } from './views/view-manage/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: 'view',
    canActivate: [RouteGuard],
    canActivateChild: [RouteGuard],
    loadChildren: () =>
      import('./views/view-manage/view-manage.module').then(
        (m) => m.ViewManageModule
      ),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./views/view-user/view-user.module').then(
        (m) => m.ViewUserModule
      ),
  },
  {
    path: '',
    redirectTo: '/view',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/view',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
