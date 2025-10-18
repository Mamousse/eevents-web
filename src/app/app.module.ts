import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { QRCodeModule } from 'angularx-qrcode';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Components
import { ReservationFormComponent } from './components/reservation-form/reservation-form.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { EventFormComponent } from './components/event-form/event-form.component';
import { EventDetailsComponent } from './components/event-details/event-details.component';

// Services
import { EventService } from './services/event.service';
import { ReservationService } from './services/reservation.service';
import { AuthService } from './services/auth.service';

// Guards
import { AuthGuard } from './guards/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    ReservationFormComponent,
    AdminLoginComponent,
    AdminDashboardComponent,
    EventFormComponent,
    EventDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    QRCodeModule
  ],
  providers: [
    EventService,
    ReservationService,
    AuthService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
