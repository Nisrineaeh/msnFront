import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AcceuilComponent } from './pages/acceuil/acceuil.component';
import { LoginComponent } from './pages/login/login.component';
import { UsersListComponent } from './pages/users-list/users-list.component';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserListComponent } from './components/user-list/user-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChatComponent } from './components/chat/chat.component';
import { WebsocketService } from './services/websocket.service';
import { SocketIoModule } from 'ngx-socket-io';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    AcceuilComponent,
    LoginComponent,
    UsersListComponent,
    UserListComponent,
    ChatComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    SocketIoModule.forRoot({ url: 'http://localhost:3000', options: {} }),

  ],
  providers: [WebsocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
