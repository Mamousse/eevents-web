import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { ReservationFormComponent } from './components/reservation-form/reservation-form.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { EventFormComponent } from './components/event-form/event-form.component';
import { EventDetailsComponent } from './components/event-details/event-details.component';

const routes: Routes = [
  { path: '', redirectTo: '/admin/login', pathMatch: 'full' },
  { path: 'reservation/:id', component: ReservationFormComponent },
  { path: 'admin/login', component: AdminLoginComponent },
  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
    data: { role: 'admin' }
  },
  {
    path: 'admin/events/new',
    component: EventFormComponent,
    canActivate: [AuthGuard],
    data: { role: 'admin' }
  },
  {
    path: 'admin/events/edit/:id',
    component: EventFormComponent,
    canActivate: [AuthGuard],
    data: { role: 'admin' }
  },
  {
    path: 'admin/events/:id',
    component: EventDetailsComponent,
    canActivate: [AuthGuard],
    data: { role: 'admin' }
  },
  { path: '**', redirectTo: '/admin/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
