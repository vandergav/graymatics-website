import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { HttpModule } from '@angular/http';
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
            FaceService,
            ReportsService,
            VideoService,
            VehicleService,
            ConfigurationService } from './_services/index';
import { HomeComponent } from './home/index';
import { NotificationViewComponent } from './home/index';
import { LoginComponent } from './login/index';
import { ForgotComponent } from './forgot/index';
import { ResetComponent } from './reset/index';
import { RegisterComponent } from './register/index';
import { EqualValidator } from './equal-validator.directive';

import { MainComponent } from './supervisor/camera/index';
import { AddComponent } from './supervisor/camera/index';
import { SingleAgentViewComponent } from './supervisor/dashboard/index';
import { SingleCameraViewComponent } from './supervisor/dashboard/index';
import { AgentViewComponent } from './supervisor/dashboard/index';
import { CameraViewComponent } from './supervisor/dashboard/index';
import { ROIComponent } from './supervisor/roi/index';
import { PeopleListComponent } from './supervisor/list/people_list/index';
import { VehicleListComponent } from './supervisor/list/vehicle_list/index';

import { SecurityCamViewComponent } from './security-agent/index';
import { ArchivedVideo } from './security-agent/video/index';
import { UploadedVideo } from './security-agent/video/index';
import { ViewVideoComponent } from './security-agent/video/index';
import { ROIVideoComponent } from './security-agent/roi/index';

import { SummaryComponent } from './reports/index';
import { VehicleComponent } from './reports/index';
import { NotificationReportComponent } from './reports/index';
import { FaceReportComponent } from './reports/index';

import { SearchComponent } from './search/index';

import { FaceComponent } from './face/training/index';
import { FaceSubjectComponent } from './face/training/index';
import { FaceCameraComponent } from './face/training/index';

import { FaceRecognitionComponent } from './face/recognition/index';
import { FaceRecognitionSubjectComponent } from './face/recognition/index';
import { FaceRecognitionCameraComponent } from './face/recognition/index';

import { VehicleRecognitionComponent } from './vehicle/index';

import { AlertsComponent } from './alerts/index';

import { NotificationsComponent } from './configuration/notifications/index';
import { UserListComponent } from './configuration/user_list/index';

import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';

import { NgxPaginationModule } from 'ngx-pagination';

import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
const config: SocketIoConfig = { url: appConfig.apiUrl, options: {} };

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        routing,
        ModalModule.forRoot(),
        BootstrapModalModule,
        NgxPaginationModule,
        SocketIoModule.forRoot(config)
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        NotificationViewComponent,
        SecurityCamViewComponent,
        ArchivedVideo,
        UploadedVideo,
        ViewVideoComponent,
        ROIVideoComponent,
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
        NotificationReportComponent,
        FaceReportComponent,
        MainComponent,
        AddComponent,
        EqualValidator,
        SearchComponent,
        FaceComponent,
        FaceSubjectComponent,
        FaceCameraComponent,
        FaceRecognitionComponent,
        FaceRecognitionSubjectComponent,
        FaceRecognitionCameraComponent,
        VehicleRecognitionComponent,
        PeopleListComponent,
        VehicleListComponent,
        AlertsComponent,
        NotificationsComponent,
        UserListComponent
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
        VideoService,
        FaceService,
        ReportsService,
        VehicleService,
        ConfigurationService,
        // providers used to create fake backend
        fakeBackendProvider,
        MockBackend,
        BaseRequestOptions
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }