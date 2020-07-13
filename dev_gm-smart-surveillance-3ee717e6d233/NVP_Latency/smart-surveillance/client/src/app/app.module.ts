import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { appConfig } from './app.config';
// used to create fake backend
import { fakeBackendProvider } from './_helpers/index';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions } from '@angular/http';

import { AppComponent }  from './app.component';
import { routing }        from './app.routing';

import { AlertComponent } from './_directives/index';
import { AuthGuard } from './_guards/index';
import {    AlertService, 
            AuthenticationService, 
            UserService, 
            ForgotService, 
            ResetService, 
            HomeService,
            NotificationService,
            CameraService,
            ReportsService,
            ShowErrorsComponent } from './_services/index';
import { HomeComponent } from './home/index';
import { NotificationViewComponent } from './home/index';
import { LoginComponent } from './login/index';
import { ForgotComponent } from './forgot/index';
import { ResetComponent } from './reset/index';
import { RegisterComponent } from './register/index';
import { EqualValidator } from './equal-validator.directive';
import { MainComponent } from './supervisor/camera/index';
import { AddComponent } from './supervisor/camera/index';
import { SecurityCamViewComponent } from './security-agent/index';
import { SingleAgentViewComponent } from './supervisor/dashboard/index';
import { SingleCameraViewComponent } from './supervisor/dashboard/index';
import { AgentViewComponent } from './supervisor/dashboard/index';
import { CameraViewComponent } from './supervisor/dashboard/index';
import { ROIComponent } from './supervisor/roi/index';
import { SummaryComponent } from './reports/index';
import { VehicleComponent } from './reports/index';
import { NotificationComponent } from './reports/index';
import { FaceComponent } from './reports/index';


import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';


import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { ReactiveFormsModule } from '@angular/forms';

import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
const config: SocketIoConfig = { url: appConfig.apiUrl, options: {} };

@NgModule({
    imports: [
        ReactiveFormsModule,
        BrowserModule,
        FormsModule,
        HttpModule,
        HttpClientModule,
        routing,
        ModalModule.forRoot(),
        BootstrapModalModule,
        SocketIoModule.forRoot(config)
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        NotificationViewComponent,
        SecurityCamViewComponent,
        SingleAgentViewComponent,
        SingleCameraViewComponent,
        AgentViewComponent,
        CameraViewComponent,
        ROIComponent,
        LoginComponent,
        ForgotComponent,
        ResetComponent,
        RegisterComponent,
        SummaryComponent,
        VehicleComponent,
        NotificationComponent,
        FaceComponent,
        MainComponent,
        AddComponent,
        EqualValidator,
        ShowErrorsComponent
    ],
    providers: [
        AuthGuard,
        AlertService,
        AuthenticationService,
        UserService,
        ForgotService,
        HomeService,
        ResetService,
        NotificationService,
        CameraService,
        ReportsService,
        // providers used to create fake backend
        fakeBackendProvider,
        MockBackend,
        BaseRequestOptions,
    ],
    bootstrap: [AppComponent],

})

export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule)