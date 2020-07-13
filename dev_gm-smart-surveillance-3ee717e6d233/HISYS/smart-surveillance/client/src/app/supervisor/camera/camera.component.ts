import { Component, OnInit, ViewContainerRef, ViewEncapsulation , ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../../_services/index';
import { CameraService, HomeService } from '../../_services/index';
import { Camera } from '../../_models/index';
import { StartCamera } from '../../_models/index';
import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'angular2-modal';
import { Modal, BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { Socket } from 'ng-socket-io';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'camera.component.html',
    providers: [Modal]
})

export class AddComponent implements OnInit {
    public camera: Camera;
    public startCamera: StartCamera;
    private myForm: FormGroup;

    model: any = {};
    response: any = {};
    response4: any = {};
    currentUser: string;
    message: string;
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
        private homeService: HomeService,
        private elRef:ElementRef,
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService,
        private cameraService: CameraService,
        public modal: Modal,
        private socket: Socket) { 
            this.currentUser = localStorage.getItem('currentUser');
        }

    ngOnInit() {
        this.camera = {
            camera_id:0,
            vehicleTracking :false,
            peopleTracking :false,
            user_id : '',
            name:'',
            type:'',
            source: '',
            fps:'',
            gps: '',
            status:'',
            agent:'',
            algo : []
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

        this.getMessage()
        .subscribe(message => {
            var timeStampInMs = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now();
            console.log("====== After fetching the results ==== ",timeStampInMs);        
        })
    }
    remove(i: number) {
        (<FormArray>this.myForm.controls.mediaPath).removeAt(i);
    }
    
    add() {
        (<FormArray>this.myForm.controls.mediaPath).push(this.buildMediaComponent());
    }
    
    buildMediaComponent() {
        return new FormControl('', [Validators.required]);
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
    addCamera(url: string) {
        var timeStampInMs = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now();
        console.log("====== Before submitting image ==== ",timeStampInMs);        
        
        // superviser start camera api
        this.startCamera.user_id = 1;
        this.startCamera.camera_id = 12;
        this.startCamera.name = "test_image.jpg";
        this.startCamera.port = "80";
        
        this.startCamera.source = url;
        // this.startCamera.source = myForm.value.mediaPath[0];
        this.startCamera.protocol = "RTSP";
        this.startCamera.interface = "onvif";
        this.startCamera.algos = '["THEMES"]';

        // start cameras

        this.homeService.start(this.startCamera)
        .subscribe(
            data => {
                this.response4 = data;
                if(this.response4.status == 'error'){
                    alert("Platform is not running. Please try after sometime.");
                }else {
                    // var timeStampInMs_A = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now();
                    // console.log("====== After submission time ==== ",timeStampInMs_A);        
                    console.log("Response: from the start camera::",this.response4);
                }
            },
            error => {
                console.log("error");
            }
        );
    }

    
}
