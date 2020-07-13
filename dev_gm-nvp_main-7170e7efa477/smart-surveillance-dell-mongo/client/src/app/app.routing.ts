import { Routes, RouterModule } from '@angular/router';

import { RegisterComponent } from './register/index';

import { HomeComponent } from './home/index';
import { NotificationViewComponent } from './home/index';
import { LoginComponent } from './login/index';
import { ForgotComponent } from './forgot/index';
import { ResetComponent } from './reset/index';

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

import { AuthGuard } from './_guards/index';

const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'forgot', component: ForgotComponent },
    { path: 'reset/:user_id/:code', component: ResetComponent },
    { path: 'home', component: HomeComponent },
    
    { path: 'supervisor/dashboard/agent-view', component:  AgentViewComponent},
    { path: 'supervisor/dashboard/camera-view', component:  CameraViewComponent},
    { path: 'supervisor/dashboard/single-agent-view', component:  SingleAgentViewComponent},
    { path: 'supervisor/dashboard/single-camera-view', component:  SingleCameraViewComponent},
    { path: 'supervisor/camera/main', component: MainComponent },
    { path: 'supervisor/camera/add', component:  AddComponent},
    { path: 'supervisor/roi', component:  ROIComponent},
    { path: 'supervisor/people-list', component:  PeopleListComponent},
    { path: 'supervisor/vehicle-list', component:  VehicleListComponent},
    
    { path: 'notification/view', component: NotificationViewComponent },
    
    { path: 'security/camera/view', component:  SecurityCamViewComponent },
    { path: 'security-agent/video/archived', component:  ArchivedVideo },
    { path: 'security-agent/video/uploaded', component:  UploadedVideo },
    { path: 'security-agent/video/view', component:  ViewVideoComponent },
    { path: 'security-agent/video/roi', component:  ROIVideoComponent },
    
    { path: 'reports/summary', component: SummaryComponent },
    { path: 'reports/vehicle', component: VehicleComponent },
    { path: 'reports/notification', component: NotificationReportComponent },
    { path: 'reports/face', component: FaceReportComponent },

    { path: 'search', component: SearchComponent },

    { path: 'face/training', component: FaceComponent },
    { path: 'face/training/add', component: FaceSubjectComponent },
    { path: 'face/training/camera', component: FaceCameraComponent },

    { path: 'face/recognition', component: FaceRecognitionComponent },
    { path: 'face/recognition/add', component: FaceRecognitionSubjectComponent },
    { path: 'face/recognition/camera', component: FaceRecognitionCameraComponent },
    
    { path: 'vehicle/recognition', component: VehicleRecognitionComponent },
    
    { path: 'configuration/alerts', component: AlertsComponent },

    { path: 'configuration/notifications', component: NotificationsComponent },
    { path: 'configuration/user_list', component: UserListComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);