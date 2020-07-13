import { Component, OnInit, ViewContainerRef, ViewEncapsulation , ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../../_services/index';
import { VideoService } from '../../_services/index';
import { Video } from '../../_models/index';
import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'angular2-modal';
import { Modal, BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'uploaded_video.component.html',
    providers: [Modal]
})

export class UploadedVideo implements OnInit {
    public video: Video;
    model: any = {};
    response: any = {};
    response1: any = {};
    currentUser: string;
    loading = false;
    returnUrl: string;
    videoTypeDropDown = false;
    resolutionDropDown = false;
    fpsDropDown = false;
    agenDropDown = false;
    videoFpsValue = '10';
    updateFlag = false;
    videoTypeDropDownValue = 'Sterile Zone Monitoring';
    algoArr = new Array();
    
    constructor(
        private elRef:ElementRef,
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService,
        private videoService: VideoService,
        public modal: Modal) { 
            this.currentUser = localStorage.getItem('currentUser');
        }

    ngOnInit() {
        this.video = {
            _id:'',
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
            source: '',
            roi: [''],
            frame: '',
            fps:'',
            gps: '',
            status:'',
            protocol: '',
            interface: '',
            agent:'',
            algo : [''],
            media_type : ''
        }
        // get query params from router
        this.route
        .queryParams
        .subscribe(params => {
            // Defaults to 0 if no query param provided.
            // set camera details
            this.video._id = params['_id'];
            this.video.name = params['name'];
            this.video.user_id = params['user_id'];
            this.video.type = params['type'];
            this.videoTypeDropDownValue = params['type'];
            this.video.source = params['source'];
            this.video.fps = params['fps'];
            this.videoFpsValue = params['fps'];
            this.video.agent = params['agent'];
            // algo subscription iteration
            if ( typeof params['algo'] != 'undefined' && params['algo'].length > 0 ) {
                for ( var a=0; a < params['algo'].length ; a++ ) {
                    var key = params['algo'][a];
                    if( key == 'peopel_count' ) this.video.peopleCount = true;
                    if( key == 'vehicle_count' ) this.video.vehicleCount = true;
                    if( key == 'vehicle_speed' ) this.video.vehicleSpeed = true;
                    if( key == 'person_tracking' ) this.video.peopleTracking = true;
                    if( key == 'vehicle_tracking' ) this.video.vehicleTracking = true;
                    if( key == 'INTRUSION' ) this.video.intrusionDetection = true;
                    if( key == 'FACE_ANALYTICS' ) this.video.faceAnalytics = true;
                    if( key == 'FACE_RECOGNITION' ) this.video.faceRecognition = true;
                    if( key == 'VIOLENCE' ) this.video.violence = true;
                    if( key == 'ANPR' ) this.video.anpr = true;
                    if( key == 'THEME' ) this.video.theme = true;
                }
            }
            if(params['_id'])
            this.updateFlag = true;
        });    
    }
    video_type(){
        this.videoTypeDropDown = !this.videoTypeDropDown;
    }
    video_type_value(value:string){
        this.videoTypeDropDownValue = value;
        this.videoTypeDropDown = !this.videoTypeDropDown;
    }
    video_fps(){
        this.fpsDropDown = !this.fpsDropDown;
    }
    video_fps_value(value:string){
        this.videoFpsValue = value;
        this.fpsDropDown = !this.fpsDropDown;
    }
    edit(model: Video , isValid: boolean){
        if(!isValid) return;
        this.video.type = this.videoTypeDropDownValue;
        this.video.fps = this.videoFpsValue;
        this.videoService.update(this.video)
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
                                this.router.navigate(['/security-agent/video/archived']);
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
    add(model: Video, isValid: boolean) {
        console.log("in add component::", isValid, this.updateFlag, model.vehicleTracking);
        if(this.updateFlag == true) {
            this.edit(this.video, isValid);
            return;
        }
        if(!isValid) return;
        this.loading = true;
        this.video.user_id = localStorage.getItem("user_id");
        this.video.type = this.videoTypeDropDownValue;
        this.video.fps = this.videoFpsValue;
        this.video.algo = new Array();
        this.video.status = 'processing';
        // add the algo list to camera array
        if(model.vehicleCount) this.video.algo.push("vehicle_count");
        if(model.peopleCount) this.video.algo.push("people_count");
        if(model.vehicleSpeed) this.video.algo.push("vehicle_speed");
        if(model.vehicleTracking) this.video.algo.push("vehicle_tracking");
        if(model.peopleTracking) this.video.algo.push("person_tracking");
        if(model.faceRecognition) this.video.algo.push("FACE_RECOGNITION");
        if(model.faceAnalytics) this.video.algo.push("FACE_ANALYTICS");
        if(model.intrusionDetection) this.video.algo.push("INTRUSION");
        if(model.peopleList) this.video.algo.push("people_blacklist_whitelist");
        if(model.vehicleList) this.video.algo.push("vehicle_blacklist_whitelist");
        if(model.anpr) this.video.algo.push("ANPR");
        if(model.violence) this.video.algo.push("VIOLENCE");
        if(model.theme) this.video.algo.push("THEME");
        // add camera 
        this.videoService.add(this.video)
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
                                this.video._id = this.response.video._id;
                                this.video.status = 'processing';
                                this.video.protocol = 'RTSP';
                                this.video.interface = 'onvif';
                                this.video.roi = [''];
                                this.video.media_type = 'video';
                                this.videoService.start_frame(this.video)
                                    .subscribe(
                                        data => {
                                            this.response1 = data;
                                            if(this.response1.status == 'error') {
                                                this.alertService.error(this.response1.message, true);
                                            } else {
                                                this.router.navigate(['/security-agent/video/roi'],{ queryParams: 
                                                    {   
                                                        name        : this.video.name , 
                                                        _id         : this.response.video._id,
                                                        user_id     : this.video.user_id,
                                                        frame       : this.response1.frame,
                                                        source      : this.video.source,
                                                        protocol    : this.video.protocol,
                                                        status      : this.video.status,
                                                        interface   : this.video.interface,
                                                        algos       : this.video.algo
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
