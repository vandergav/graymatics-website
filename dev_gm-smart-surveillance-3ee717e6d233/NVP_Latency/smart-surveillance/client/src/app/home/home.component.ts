//import '../../assets/css/default.css';

import { Component, OnInit, Injectable, Renderer2} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../_models/index';
import {    HomeService,
            AlertService, 
            AuthenticationService,
            NotificationService,
            CameraService } from '../_services/index';
import { Socket } from 'ng-socket-io';
import { Camera } from '../_models/index';
import { StartCamera } from '../_models/index';
import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'angular2-modal';
import { Modal, BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';


@Component({    
    moduleId: module.id.toString(),
    templateUrl: 'home.component.html',
    providers: [Modal]
})


@Injectable()
export class HomeComponent implements OnInit {
    public camera: Camera;
    public startCamera: StartCamera;
    currentUser: string;
    users: User[] = [];
    data: any = {};
    latest_notification: any[] = [];
    returnUrl: string;
    full_screen_view: string;
    full_screen_cam_id: string;
    full_screen_cam_name: string;
    message: any = {};
    msg : any[] = [];
    cams : any[] = [];
    frames : any[] = [];
    model: any = {};
    response: any = {};
    response1: any = {};
    red_border:boolean = false;
    green_border:boolean = false;
    yellow_border:boolean = false;
    red:boolean = false;
    green:boolean = false;
    yellow:boolean = false;
    default:boolean = false;
    red_count: any = {};
    red_action_count: any = {};
    green_count: any = {};
    green_action_count: any = {};
    yellow_count: any = {};
    yellow_action_count: any = {};
    response4: any = {};
    loading = false;
    camera_type: string;
    timestamp: string;
    notification_text: string;
    isParaActive:boolean = true;
    isBtnActive:boolean = true;
    isSmall:boolean = false;
    isBig:boolean = false;

    constructor(private homeService: HomeService,
                private route: ActivatedRoute,
                private alertService:AlertService,
                private notificationService: NotificationService,
                private cameraService: CameraService,
                private router: Router,
                public modal: Modal,
                private renderer: Renderer2,
                private socket: Socket) {
        this.currentUser = localStorage.getItem('currentUser');
    }
    ngOnInit() {
        //default notification type
        //this.default = true;
        this.green = true;
        this.green_border = true;
        //default src for full screen view
        this.full_screen_view = "https://s3.amazonaws.com/2g3c-codes/no-feed.jpg";
        this.camera = {
            camera_id:0,
            vehicleTracking: false,
            peopleTracking: false,
            user_id : '',
            name:'',
            type:'',
            fps:'',
            source: '',
            gps: '',
            status:'',
            agent:'',
            algo:['']
        }
        this.startCamera = {
            camera_id:0,
            user_id:0,
            name:'',
            source: '',
            protocol:'',
            interface:'',
            fps:'',
            algos:'',
            port:''
        }
        // commented for time being
        this.home();
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    delete_camera(camera_id: string){
        console.log("camera_id:",camera_id);
        this.cameraService.remove(camera_id)
            .subscribe(
                data => {
                    this.response = data;
                    if(this.response.status == 'error'){
                        //this.alertService.error(this.response.message, true);
                        alert(this.response.message);
                    }
                    else{
                        // Remove camera from ui
                        document.getElementById("cam_"+camera_id).remove();
                        const dialog =   this.modal.alert()
                                        .size('sm')
                                        .body(this.response.message)
                                        .open();
                         dialog                    
                        .catch((err: any) => console.log('ERROR: ' + err))
                        .then((dialog: any) => { return dialog.result })
                        .then((result: any) => { 
                                this.router.navigate(['this.returnUrl']);
                            })
                        .catch((err: any) => { alert("catch") });
                    }
                },
                error => {
                    alert("Server Error!");
                    this.loading = false;
                });
    }
    // Reconnect camera
    reset_camera(cam:any){
        // Set camera properties
        this.startCamera.user_id = cam.user_id;
        this.startCamera.camera_id = cam.camera_id;
        this.startCamera.name = cam.name;
        this.startCamera.port = "80";
        this.startCamera.source = cam.source;
        this.startCamera.protocol = cam.protocol;
        this.startCamera.interface = cam.interface;
        this.startCamera.fps = cam.fps;
        this.startCamera.algos = cam.algo;
        //start camera
        this.homeService.start(this.startCamera)
        .subscribe(
            data => {
                this.response4 = data;
            },
            error => {
                console.log("error");
            }
        );
        // Reset camera notification flags
        // this.cameraService.reset(cam.camera_id)
        //     .subscribe(
        //         data => {
        //             //updated
        //         },
        //         error => {
        //             //error
        //         }
        //     )
    }
    // get a message from server socket.io 
    getMessage() {
        return this.socket
            .fromEvent<any>("msg")
            .map(data => data.msg);
    }
    // send a message to server socket.io 
    sendMessage(msg: string) {
        this.socket
            .emit("msg", msg);
    }
    // Get cameras list and notification info
    home() {
        this.loading = true;
        this.homeService.listCams()
            .subscribe(
                data => {
                    this.response = data;
                    if(this.response.status == 'error'){
                        alert(this.response.message);
                    }
                    else{
                        this.cams = this.response.data;
                    }
                },
                error => {
                    alert("Server Error!");
                    //this.alertService.error("server error");
                    this.loading = false;
                });
        
        // Get socket messages    
        // this.getMessage()
        // .subscribe(message => {
        //     var timeStampInMs = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now();
        //     console.log("====== After fetching the results ==== ",timeStampInMs);        
            // this.home();
        // })
    }
}