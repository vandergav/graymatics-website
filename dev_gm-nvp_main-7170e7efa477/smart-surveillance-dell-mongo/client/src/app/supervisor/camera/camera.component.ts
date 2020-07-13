import { Component, OnInit, ViewContainerRef, ViewEncapsulation , ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../../_services/index';
import { CameraService } from '../../_services/index';
import { Camera } from '../../_models/index';
import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'angular2-modal';
import { Modal, BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'camera.component.html',
    providers: [Modal]
})

export class AddComponent implements OnInit {
    public camera: Camera;
    model: any = {};
    response: any = {};
    response1: any = {};
    currentUser: String;
    loading = false;
    returnUrl: string;
    camTypeDropDown = false;
    resolutionDropDown = false;
    fpsDropDown = false;
    agenDropDown = false;
    camFpsValue = '10';
    updateFlag = false;
    camTypeDropDownValue = 'Sterile Zone Monitoring';
    algoArr = new Array();
    
    constructor(
        private elRef:ElementRef,
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService,
        private cameraService: CameraService,
        public modal: Modal) { 
            this.currentUser = localStorage.getItem('currentUser');
        }

    ngOnInit() {
        this.camera = {
            _id:'',
            peopleCount: false,
            vehicleCount: false,
            vehicleSpeed: false,
            vehicleTracking :false,
            peopleTracking :false,
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
            source: '',
            roi: [''],
            frame: '',
            fps:'',
            gps: '',
            status:'',
            protocol: '',
            interface: '',
            agent:'',
            media_type:'',
            algo : [''],
            people_whitelist: '',
            people_blacklist: '',
            vehicle_whitelist: '',
            vehicle_blacklist: ''
        }
        // get query params from router
        this.route
        .queryParams
        .subscribe(params => {
            // Defaults to 0 if no query param provided.
            // set camera details
            this.camera._id = params['_id'];
            this.camera.name = params['name'];
            this.camera.user_id = params['user_id'];
            this.camera.type = params['type'];
            this.camTypeDropDownValue = params['type'];
            this.camera.source = params['source'];
            this.camera.fps = params['fps'];
            this.camFpsValue = params['fps'];
            this.camera.agent = params['agent'];
            this.camera.gps = params['gps'];
            // algo subscription iteration
            if ( typeof params['algo'] != 'undefined' && params['algo'].length > 0 ) {
                for ( var a=0; a < params['algo'].length ; a++ ) {
                    var key = params['algo'][a];
                    if( key == 'peopel_count' ) this.camera.peopleCount = true;
                    if( key == 'vehicle_count' ) this.camera.vehicleCount = true;
                    if( key == 'vehicle_speed' ) this.camera.vehicleSpeed = true;
                    if( key == 'person_tracking' ) this.camera.peopleTracking = true;
                    if( key == 'vehicle_tracking' ) this.camera.vehicleTracking = true;
                    if( key == 'INTRUSION' ) this.camera.intrusionDetection = true;
                    if( key == 'FACE_ANALYTICS' ) this.camera.faceAnalytics = true;
                    if( key == 'FACE_RECOGNITION' ) this.camera.faceRecognition = true;
                    if( key == 'VIOLENCE' ) this.camera.violence = true;
                    if( key == 'ANPR' ) this.camera.anpr = true;
                    if( key == 'THEME' ) this.camera.theme = true;
                }
            }
            if(params['_id'])
            this.updateFlag = true;
        });    
    }
    camera_type(){
        this.camTypeDropDown = !this.camTypeDropDown;
    }
    camera_type_value(value:string){
        this.camTypeDropDownValue = value;
        this.camTypeDropDown = !this.camTypeDropDown;
    }
    camera_fps(){
        this.fpsDropDown = !this.fpsDropDown;
    }
    camera_fps_value(value:string){
        this.camFpsValue = value;
        this.fpsDropDown = !this.fpsDropDown;
    }
    camera_agent_value(value:string) {
        this.camera.agent = value;
    }
    edit(model: Camera , isValid: boolean){
        if(!isValid) return;
        this.camera.type = this.camTypeDropDownValue;
        this.camera.fps = this.camFpsValue;
        this.cameraService.update(this.camera)
            .subscribe(
                data => {
                    //this.alertService.success('Registration successful', true);
                    this.response = data;
                    if(this.response.status == 'error'){
                        //this.alertService.error(this.response.message, true);
                        var msg = JSON.parse(this.response.message.replace(/\\/g, ""));
                        if(msg.user_id)
                            this.alertService.error(this.response.message, true);
                    }
                    else{
                        //alert(this.response.message);
                        const dialog =   this.modal.alert()
                                        .size('sm')
                                        .body(this.response.message)
                                        .open();
                         dialog                    
                        .catch((err: any) => console.log('ERROR: ' + err))
                        .then((dialog: any) => { return dialog.result })
                        .then((result: any) => { 
                                this.router.navigate(['/supervisor/camera/main']);
                        })
                        .catch((err: any) => { alert("catch") });
                    }
                },
                error => {
                     this.modal.alert()
                    .size('sm')
                    .body("Server Error")
                    .open();
                    //this.alertService.error(error);
                    this.loading = false;
                });
    }
    add(model: Camera, isValid: boolean) {
        console.log("in add component::", isValid, this.updateFlag, model.vehicleTracking);
        if(this.updateFlag == true) {
            this.edit(this.camera, isValid);
            return;
        }
        if(!isValid) return;
        this.loading = true;
        this.camera.user_id = localStorage.getItem("user_id");
        this.camera.type = this.camTypeDropDownValue;
        this.camera.fps = this.camFpsValue;
        this.camera.algo = new Array();
        // add the algo list to camera array
        if(model.vehicleCount) this.camera.algo.push("vehicle_count");
        if(model.peopleCount) this.camera.algo.push("people_count");
        if(model.vehicleSpeed) this.camera.algo.push("vehicle_speed");
        if(model.vehicleTracking) this.camera.algo.push("vehicle_tracking");
        if(model.peopleTracking) this.camera.algo.push("person_tracking");
        if(model.faceRecognition) this.camera.algo.push("FACE_RECOGNITION");
        if(model.faceAnalytics) this.camera.algo.push("FACE_ANALYTICS");
        if(model.intrusionDetection) this.camera.algo.push("INTRUSION");
        if(model.peopleList) this.camera.algo.push("people_blacklist_whitelist");
        if(model.vehicleList) this.camera.algo.push("vehicle_blacklist_whitelist");
        if(model.anpr) this.camera.algo.push("ANPR");
        if(model.violence) this.camera.algo.push("VIOLENCE");
        if(model.theme) this.camera.algo.push("THEME");
        
        // add camera 
        this.cameraService.add(this.camera)
            .subscribe(
                data => {
                    this.response = data;
                    if(this.response.status == 'error'){
                        var msg = JSON.parse(this.response.message.replace(/\\/g, ""));
                        if(msg.user_id)
                            this.alertService.error(this.response.message, true);
                    }
                    else{
                        const dialog =   this.modal.alert()
                                        .size('sm')
                                        .body(this.response.message)
                                        .open();
                         dialog                    
                        .catch((err: any) => console.log('ERROR: ' + err))
                        .then((dialog: any) => { return dialog.result })
                        .then((result: any) => {
                                // start frame api call
                                this.camera._id = this.response.camera._id;
                                this.camera.protocol = 'RTSP';
                                this.camera.interface = 'onvif';
                                this.camera.roi = [''];
                                this.camera.media_type = 'camera';
                                this.cameraService.start_frame(this.camera)
                                    .subscribe(
                                        data => {
                                            this.response1 = data;
                                            console.log(this.response1);
                                            if(this.response1.status == 'error') {
                                                // this.alertService.error(this.response1.message, true);
                                                this.modal.alert()
                                                .size('sm')
                                                .body(this.response1.message)
                                                .open();
                                                this.loading = false;
                                            } else {
                                                this.router.navigate(['/supervisor/roi'],{ queryParams: 
                                                    {   
                                                        name        : this.camera.name , 
                                                        _id         : this.response.camera._id,
                                                        user_id     : this.camera.user_id,
                                                        frame       : this.response1.frame,
                                                        source      : this.camera.source,
                                                        protocol    : this.camera.protocol,
                                                        interface   : this.camera.interface,
                                                        algos       : this.camera.algo
                                                    }
                                                });
                                            }
                                        }
                                    )
                        })
                        .catch((err: any) => { alert("catch") });
                    }
                },
                error => {
                     this.modal.alert()
                    .size('sm')
                    .body("Server Error")
                    .open();
                    //this.alertService.error(error);
                    this.loading = false;
                });
    
    }
}
