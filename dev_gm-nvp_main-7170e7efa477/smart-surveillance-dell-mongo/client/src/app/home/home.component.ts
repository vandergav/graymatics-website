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
    cams : any[''] = [''];
    frames : any[] = [];
    model: any = {};
    response: any = {};
    response1: any = {};
    search_results: any = {};
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
    keyword:string;

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
            _id: '',
            peopleCount: false,
            vehicleCount: false,
            vehicleSpeed: false,
            vehicleTracking: false,
            peopleTracking: false,
            faceRecognition: false,
            intrusionDetection: false,
            peopleList: false,
            vehicleList: false,
            faceAnalytics : false,
            deepAssurance : false,
            carCrashDetection : false,
            wrongTurnDetection : false,
            parkingViolation : false,
            crowdDetection : false,
            fashion : false,
            litterDetection : false,
            helmetDetection : false,
            climbingDetection : false,
            theme : false,
            anpr : false,
            violence : false,
            user_id : '',
            name:'',
            type:'',
            fps:'',
            source: '',
            roi: [''],
            frame: '',
            gps: '',
            status:'',
            protocol: '',
            interface: '',
            agent:'',
            media_type:'',
            algo:[''],
            people_whitelist: '',
            people_blacklist: '',
            vehicle_whitelist: '',
            vehicle_blacklist: ''
        }
        this.startCamera = {
            _id: '',
            user_id: '',
            name:'',
            source: '',
            protocol:'',
            interface:'',
            fps:'',
            algos:[''],
            port:'',
            roi: [''],
            media_type:''
        }
        this.home();
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }
    // toggle button 
    menuToggle(event: Event){
        event.preventDefault();
        this.isParaActive = !this.isParaActive;
        this.isBtnActive = !this.isBtnActive;
    }
    // notification toggle 
    notificationToggle(event: Event,tab:string){
        event.preventDefault();
        this.red_border=!this.red_border;
        this.default=!this.default;
        this.yellow_border=false;
        this.green_border=false
        //if(tab=='red')this.red = !this.red;
        if(tab=='green')this.green = !this.green;
        if(tab=='yellow')this.yellow = !this.yellow
    }
    // toggle button 
    fullScreen(event: Event,_id: string,camera_name: string){
        event.preventDefault();
        this.isBig = !this.isBig;
        this.isSmall = !this.isSmall;
        this.full_screen_cam_id = _id;
        this.full_screen_cam_name = camera_name;
    }
    security_cam_view(_id: number){
        this.router.navigate(['/security/camera/view'],{ queryParams: { _id : _id } });
    }
    delete_camera(_id: string){
        this.cameraService.remove(_id)
            .subscribe(
                data => {
                    this.response = data;
                    if(this.response.status == 'error'){
                        //this.alertService.error(this.response.message, true);
                        alert(this.response.message);
                    }
                    else{
                        // Remove camera from ui
                        document.getElementById("cam_"+_id).remove();
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
        // Activate related notification color border based on cam type
        switch(cam.algo) {
            case 'person_tracking':
                // Activate green notification section
                this.green = true;
                this.yellow = false;
                this.red = false;
                // Activate green border notification section
                this.green_border = true;
                this.yellow_border = false;
                this.red_border = false;
                break;
            case 'vehicle_tracking':
                // Activate yellow notification section
                this.yellow = true;
                this.green = false;
                this.red = false;
                // Activate yellow border notification section
                this.yellow_border = true;
                this.green_border = false;
                this.red_border = false;
                break;
        }
        // Remove dom element notification
        if(cam._id == 1)
        document.getElementById("3").innerHTML = "";
        if(cam._id == 2)
        document.getElementById("2").innerHTML = "";
        //Remove camera notification 
        this.notificationService.remove(cam._id)
            .subscribe(
            data => {
                // removed notification
            },
            error => {
                console.log("error");
            }
        );

        // Set camera properties
        this.startCamera.user_id = cam.user_id;
        this.startCamera._id = cam._id;
        this.startCamera.name = cam.name;
        this.startCamera.port = "80";
        this.startCamera.source = cam.source;
        this.startCamera.protocol = cam.protocol;
        this.startCamera.interface = cam.interface;
        this.startCamera.fps = cam.fps;
        this.startCamera.roi = cam.roi;
        this.startCamera.algos = cam.algo;
        this.startCamera.media_type = "camera";
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
        this.cameraService.reset(cam._id)
            .subscribe(
                data => {
                    //updated
                },
                error => {
                    //error
                }
            )
        // update the notification section
        // green notiifcation count for today
        this.notificationService.count('People_Count','camera')
            .subscribe(
                data => {
                    this.green_count = data ;
                },
                error => {
                    console.log("error");
                }
            )
        // green notiifcation action count for today
        this.notificationService.action_count('People_Count','camera')
            .subscribe(
                data => {
                    this.green_action_count = data ;
                },
                error => {
                    console.log("error");
                }
            )
        // yellow notiifcation count for today
        this.notificationService.count('Vehicle_Count','camera')
            .subscribe(
                data => {
                    this.yellow_count = data ;
                },
                error => {
                    console.log("error");
                }
            )
        // yellow notiifcation action count for today
        this.notificationService.action_count('Vehicle_Count','camera')
            .subscribe(
                data => {
                    this.yellow_action_count = data ;
                },
                error => {
                    console.log("error");
                }
            )
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
                        for(var s=0; s < this.cams.length ; s++){
                            // set camera details
                            this.startCamera.user_id = this.cams[s].user_id;
                            this.startCamera._id = this.cams[s]._id;
                            this.startCamera.name = this.cams[s].name;
                            this.startCamera.port = "80";
                            this.startCamera.source = this.cams[s].source;
                            this.startCamera.protocol = this.cams[s].protocol;
                            this.startCamera.interface = this.cams[s].interface;
                            this.startCamera.roi = this.cams[s].roi;
                            this.startCamera.fps = this.cams[s].fps;
                            this.startCamera.algos = this.cams[s].algo;
                            this.startCamera.media_type = "camera";
                            //start cameras
                            this.homeService.start(this.startCamera)
                            .subscribe(
                                data => {
                                    this.response4 = data;
                                    if(this.response4.status == 'error'){
                                        alert(this.response4.message);
                                    }else {
                                        /*
                                        this.camera._id = 5;
                                        this.camera.status = "running";
                                        this.cameraService.update(this.camera)
                                            .subscribe(
                                                data => {
                                                    //updated
                                                },
                                                error => {
                                                    //error
                                                }
                                            )
                                        */
                                    }
                                },
                                error => {
                                    console.log("error");
                                }
                            );
                        }
                        // red notiifcation count for today 
                        this.notificationService.count('INTRUSION','camera')
                         .subscribe(
                             data => {
                                 this.red_count = data ;
                             },
                             error => {
                                 console.log("error");
                             }
                        )
                        // red notiifcation action count for today
                        this.notificationService.action_count('INTRUSION','camera')
                         .subscribe(
                             data => {
                                 this.red_action_count = data ;
                             },
                             error => {
                                 console.log("error");
                             }
                        )
                        // green notiifcation count for today 
                        this.notificationService.count('People_Count','camera')
                            .subscribe(
                                data => {
                                    this.green_count = data ;
                                },
                                error => {
                                    console.log("error");
                                }
                            )
                        // green notiifcation action count for today
                        this.notificationService.action_count('People_Count','camera')
                            .subscribe(
                                data => {
                                    this.green_action_count = data ;
                                },
                                error => {
                                    console.log("error");
                                }
                            )
                        // yellow notiifcation count for today
                        this.notificationService.count('Vehicle_Count','camera')
                            .subscribe(
                                data => {
                                    this.yellow_count = data ;
                                },
                                error => {
                                    console.log("error");
                                }
                            )
                        // yewllow notiifcation action count for today
                        this.notificationService.action_count('Vehicle_Count','camera')
                            .subscribe(
                                data => {
                                    this.yellow_action_count = data ;
                                },
                                error => {
                                    console.log("error");
                                }
                            )
                        // Get latest 50 notifications
                        this.notificationService.latest("camera")
                            .subscribe(
                                data => {
                                    this.response1 = data;
                                    this.latest_notification = this.response1.data;
                                    // Empty the notification div before append
                                    document.getElementById("1").innerHTML = "";
                                    document.getElementById("2").innerHTML = "";
                                    document.getElementById("3").innerHTML = "";
                                    //document.getElementById("4").innerHTML = "";
                                    for(var l in this.latest_notification) {
                                        // Append to red notification serction
                                        if(this.latest_notification[l].type == 'INTRUSION') {
                                            //Append red notification child
                                            var div1 = document.createElement('div');
                                                div1.className = 'red-notified-message notification-msg';
                                                div1.id = this.latest_notification[l]._id;
                                                div1.setAttribute("scene_id",this.latest_notification[l].scene_id);
                                            this.renderer.listen(div1, 'click', (evt) => {
                                                console.log('Clicking the button', evt.target.id);
                                                this.router.navigate(['/notification/view'],{ queryParams: { scene_id : document.getElementById(evt.target.id).getAttribute('scene_id') , notification_id : evt.target.id, media_type : 'camera' } });
                                            });    

                                            var div2 = document.createElement('div');
                                                if(this.latest_notification[l].status == 'complete')
                                                    div2.className = 'seen';
                                                else
                                                    div2.className = 'info';
                                                div2.style.pointerEvents = 'none';
                                            var h5 = document.createElement('h5');
                                                h5.innerHTML = this.latest_notification[l].camera_name;
                                                h5.style.pointerEvents = 'none';
                                            // var span = document.createElement('span');
                                            // var d = new Date(parseInt(this.latest_notification[l].timestamp)*1000);
                                            //     span.innerHTML = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear() +" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
                                            //     span.style.pointerEvents = 'none';
                                            var div3 = document.createElement('div');
                                                div3.className = 'describtion-text';
                                                div3.style.pointerEvents = 'none';
                                            var p = document.createElement('p');
                                                p.innerHTML = this.latest_notification[l].message;
                                                p.style.pointerEvents = 'none';
                                        
                                            div2.appendChild(h5);
                                            // div2.appendChild(span);
                                            div3.appendChild(p);
                                            div1.appendChild(div2);
                                            div1.appendChild(div3);
                                           // Adding notification to the red tab
                                           document.getElementById("1").appendChild(div1);
                                        }
                                        // Append to yellow notification serction
                                        if(this.latest_notification[l].type == 'Vehicle_Count') {
                                            //Append yellow notification child
                                            var div1 = document.createElement('div');
                                                div1.className = 'yellow-notified-message notification-msg';
                                                div1.id = this.latest_notification[l]._id;
                                                div1.setAttribute("scene_id",this.latest_notification[l].scene_id);
                                            this.renderer.listen(div1, 'click', (evt) => {
                                                console.log('Clicking the button', evt.target.id , document.getElementById(evt.target.id).getAttribute('scene_id'));
                                                this.router.navigate(['/notification/view'],{ queryParams: { scene_id : document.getElementById(evt.target.id).getAttribute('scene_id') , notification_id : evt.target.id, media_type : 'camera' } });
                                            });    

                                            var div2 = document.createElement('div');
                                                if(this.latest_notification[l].status == 'complete')
                                                    div2.className = 'seen';
                                                else
                                                    div2.className = 'info';
                                                div2.style.pointerEvents = 'none';
                                            var h5 = document.createElement('h5');
                                                h5.innerHTML = this.latest_notification[l].camera_name;
                                                h5.style.pointerEvents = 'none';
                                            // var span = document.createElement('span');
                                            // var d = new Date(parseInt(this.latest_notification[l].timestamp)*1000);
                                            //     span.innerHTML = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear() +" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
                                            //     span.style.pointerEvents = 'none';
                                            var div3 = document.createElement('div');
                                                div3.className = 'describtion-text';
                                                div3.style.pointerEvents = 'none';
                                            var p = document.createElement('p');
                                                p.innerHTML = this.latest_notification[l].message;
                                                p.style.pointerEvents = 'none';
                                        
                                            div2.appendChild(h5);
                                            // div2.appendChild(span);
                                            div3.appendChild(p);
                                            div1.appendChild(div2);
                                            div1.appendChild(div3);
                                            
                                            // Adding notification to the defualt tab
                                            //document.getElementById("4").appendChild(div1);
                                            // Adding notification to the yellow tab
                                            document.getElementById("2").appendChild(div1);

                                        }
                                        // Append to green notification serction
                                        if(this.latest_notification[l].type == 'People_Count') {
                                            //Append green notification child
                                            var div1 = document.createElement('div');
                                                div1.className = 'green-notified-message notification-msg';
                                                div1.id = this.latest_notification[l]._id;
                                                div1.setAttribute("scene_id",this.latest_notification[l].scene_id);
                                            this.renderer.listen(div1, 'click', (evt) => {
                                                console.log('Clicking the button', evt.target.id);
                                                this.router.navigate(['/notification/view'],{ queryParams: { scene_id : document.getElementById(evt.target.id).getAttribute('scene_id') , notification_id : evt.target.id , media_type : 'camera'} });
                                            });    

                                            var div2 = document.createElement('div');
                                                if(this.latest_notification[l].status == 'complete')
                                                    div2.className = 'seen';
                                                else
                                                    div2.className = 'info';
                                                div2.style.pointerEvents = 'none';
                                            var h5 = document.createElement('h5');
                                                h5.innerHTML = this.latest_notification[l].camera_name;
                                                h5.style.pointerEvents = 'none';
                                            // var span = document.createElement('span');
                                            // var d = new Date(parseInt(this.latest_notification[l].timestamp)*1000);
                                            //     span.innerHTML = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear() +" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
                                            //     span.style.pointerEvents = 'none';
                                            var div3 = document.createElement('div');
                                                div3.className = 'describtion-text';
                                                div3.style.pointerEvents = 'none';
                                            var p = document.createElement('p');
                                                p.innerHTML = this.latest_notification[l].message;
                                                p.style.pointerEvents = 'none';
                                        
                                            div2.appendChild(h5);
                                            // div2.appendChild(span);
                                            div3.appendChild(p);
                                            div1.appendChild(div2);
                                            div1.appendChild(div3);
                                            
                                           // Adding notification to the defualt tab
                                           //document.getElementById("4").appendChild(div1);
                                           // Adding notification to the yellow tab
                                           document.getElementById("3").appendChild(div1);
                                        }
                                        
                                    }
                                },
                                error => {
                                    console.log("error");
                                }
                            )
                        // Get socket messages    
                        this.getMessage()
                        .subscribe(message => {
                            this.message = message;
                            // console.log(this.message);
                            if(typeof this.message.cam_id != 'undefined' && typeof this.message.frame_src != 'undefined'){
                                if(typeof this.message.frame_src != 'undefined' && this.message.frame_src != null)
                                    document.getElementById('frame_'+this.message.cam_id).setAttribute("src",this.message.frame_src);
                                else
                                    document.getElementById('frame_'+this.message.cam_id).setAttribute("src","https://s3.amazonaws.com/2g3c-codes/no-feed.jpg");
                                if(this.isBig == true && this.message.cam_id == this.full_screen_cam_id)
                                this.full_screen_view = this.message.frame_src;
                            }
                            // INTRUSION count algo 
                            if(this.message.notification_type == 'INTRUSION'){
                                // Activate red notification section
                                this.yellow = false;
                                this.red = true;
                                this.green = false;
                                // Activate red border notification section
                                this.yellow_border = false;
                                this.red_border = true;
                                this.green_border = false;
                                // notiifcation count for today
                                this.notificationService.count('INTRUSION','camera')
                                    .subscribe(
                                        data => {
                                            this.red_count = data ;
                                        },
                                        error => {
                                            console.log("error");
                                        }
                                    )

                                //Append green notification child
                                var div1 = document.createElement('div');
                                    div1.className = 'red-notified-message notification-msg';
                                    div1.id = this.message.notification_id;
                                    div1.setAttribute("scene_id",this.message.scene_id);
                                this.renderer.listen(div1, 'click', (evt) => {
                                    console.log('Clicking the button', evt.target.id);
                                    this.router.navigate(['/notification/view'],{ queryParams: { scene_id : document.getElementById(evt.target.id).getAttribute('scene_id') , notification_id : evt.target.id, media_type : 'camera' } });
                                });    

                                var div2 = document.createElement('div');
                                    div2.className = 'info';
                                    div2.style.pointerEvents = 'none';
                                var h5 = document.createElement('h5');
                                    h5.innerHTML = this.message.cam_name;
                                    h5.style.pointerEvents = 'none';
                               
                                var div3 = document.createElement('div');
                                    div3.className = 'describtion-text';
                                    div3.style.pointerEvents = 'none';
                                var p = document.createElement('p');
                                    p.innerHTML = this.message.notification_text;
                                    p.style.pointerEvents = 'none';
                               
                                div2.appendChild(h5);
                                // div2.appendChild(span);
                                div3.appendChild(p);
                                div1.appendChild(div2);
                                div1.appendChild(div3);
                                // Add notification to individual green tab
                                var red_div = document.getElementById("1");
                                red_div.insertBefore(div1, red_div.childNodes[0]);
                                // Add notification to default tab
                                //var default_div = document.getElementById("4");
                                //default_div.insertBefore(div1.cloneNode(true), default_div.childNodes[0]);

                            }
                            // People count algo 
                            if(this.message.notification_type == 'People_Count'){
                                // Activate green notification section
                                this.yellow = false;
                                this.red = false;
                                this.green = true;
                                // Activate green border notification section
                                this.yellow_border = false;
                                this.red_border = false;
                                this.green_border = true;
                                // notiifcation count for today
                                this.notificationService.count('People_Count','camera')
                                    .subscribe(
                                        data => {
                                            this.green_count = data ;
                                        },
                                        error => {
                                            console.log("error");
                                        }
                                    )

                                //Append green notification child
                                var div1 = document.createElement('div');
                                    div1.className = 'green-notified-message notification-msg';
                                    div1.id = this.message.notification_id;
                                    div1.setAttribute("scene_id",this.message.scene_id);
                                this.renderer.listen(div1, 'click', (evt) => {
                                    console.log('Clicking the button', evt.target.id);
                                    this.router.navigate(['/notification/view'],{ queryParams: { scene_id : document.getElementById(evt.target.id).getAttribute('scene_id') , notification_id : evt.target.id, media_type : 'camera' } });
                                });    

                                var div2 = document.createElement('div');
                                    div2.className = 'info';
                                    div2.style.pointerEvents = 'none';
                                var h5 = document.createElement('h5');
                                    h5.innerHTML = this.message.cam_name;
                                    h5.style.pointerEvents = 'none';
                                // var span = document.createElement('span');
                                //     if((new Date(parseInt(this.message.time_stamp)*1000)).getTime() > 0){
                                //         console.log("inside timestamp");
                                //         var d = new Date(parseInt(this.message.time_stamp)*1000);
                                //         span.innerHTML = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear() +" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
                                //     }else {
                                //         span.innerHTML = this.message.time_stamp;
                                //     }
                                //     span.style.pointerEvents = 'none';
                                var div3 = document.createElement('div');
                                    div3.className = 'describtion-text';
                                    div3.style.pointerEvents = 'none';
                                var p = document.createElement('p');
                                    p.innerHTML = this.message.notification_text;
                                    p.style.pointerEvents = 'none';
                               
                                div2.appendChild(h5);
                                // div2.appendChild(span);
                                div3.appendChild(p);
                                div1.appendChild(div2);
                                div1.appendChild(div3);
                                // Add notification to individual green tab
                                var green_div = document.getElementById("3");
                                green_div.insertBefore(div1, green_div.childNodes[0]);
                                // Add notification to default tab
                                //var default_div = document.getElementById("4");
                                //default_div.insertBefore(div1.cloneNode(true), default_div.childNodes[0]);

                            }
                            // Vehicle Tracking algo
                            if(this.message.notification_type == 'Vehicle_Count'){
                                // Activate yellow notification section
                                this.green = false;
                                this.red = false;
                                this.yellow = true;
                                 // Activate green border notification section
                                 this.green_border = false;
                                 this.red_border = false;
                                 this.yellow_border = true;
                                // notiifcation count for today
                                this.notificationService.count('Vehicle_Count','camera')
                                    .subscribe(
                                        data => {
                                            this.yellow_count = data ;
                                        },
                                        error => {
                                            console.log("error");
                                        }
                                    )

                                //Append yellow notification child
                                var div1 = document.createElement('div');
                                    div1.className = 'yellow-notified-message notification-msg';
                                    div1.id = this.message.notification_id;
                                    div1.setAttribute("scene_id",this.message.scene_id);
                                this.renderer.listen(div1, 'click', (evt) => {
                                    // console.log('Clicking the button', evt.target.id);
                                    this.router.navigate(['/notification/view'],{ queryParams: { scene_id : document.getElementById(evt.target.id).getAttribute('scene_id') , notification_id : evt.target.id, media_type : 'camera' } });
                                });    

                                var div2 = document.createElement('div');
                                    div2.className = 'info';
                                    div2.style.pointerEvents = 'none';
                                var h5 = document.createElement('h5');
                                    h5.innerHTML = this.message.cam_name;
                                    h5.style.pointerEvents = 'none';
                                // var span = document.createElement('span');
                                //     if((new Date(parseInt(this.message.time_stamp)*1000)).getTime() > 0){
                                //         var d = new Date(parseInt(this.message.time_stamp)*1000);
                                //         span.innerHTML = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear() +" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
                                //     }else {
                                //         span.innerHTML = this.message.time_stamp;
                                //     }
                                //     span.style.pointerEvents = 'none';
                                var div3 = document.createElement('div');
                                    div3.className = 'describtion-text';
                                    div3.style.pointerEvents = 'none';
                                var p = document.createElement('p');
                                    p.innerHTML = this.message.notification_text;
                                    p.style.pointerEvents = 'none';
                               
                                div2.appendChild(h5);
                                // div2.appendChild(span);
                                div3.appendChild(p);
                                div1.appendChild(div2);
                                div1.appendChild(div3);

                                // Add notification to individual yellow tab
                                var yellow_div = document.getElementById("2");
                                yellow_div.insertBefore(div1, yellow_div.childNodes[0]);

                                // Add notification to defaullt tab
                                //var default_div = document.getElementById("4");
                                //default_div.insertBefore(div1.cloneNode(true), default_div.childNodes[0]);
                            }
                        });
                    }
                },
                error => {
                    alert("Server Error!");
                    //this.alertService.error("server error");
                    this.loading = false;
                });
    }

    search() {
        if (this.keyword) 
        this.router.navigate(['/search'],{ queryParams: { keyword : this.keyword, pageno : 1 , media_type : 'camera' } });
    }

    
}