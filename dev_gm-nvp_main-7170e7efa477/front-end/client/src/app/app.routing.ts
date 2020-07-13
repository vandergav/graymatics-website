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

import { FaceComponent } from './face/index';
import { FaceSubjectComponent } from './face/index';
import { FaceCameraComponent } from './face/index';

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

    { path: 'face', component: FaceComponent },
    { path: 'face/add', component: FaceSubjectComponent },
    { path: 'face/camera', component: FaceCameraComponent },
    
    

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);