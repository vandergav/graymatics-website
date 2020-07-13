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
    currentUser: string;
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
        // get query params from router
        this.route
        .queryParams
        .subscribe(params => {
            // Defaults to 0 if no query param provided.
            // set camera details
            this.camera.camera_id = params['camera_id'];
            this.camera.name = params['name'];
            this.camera.user_id = params['user_id'];
            this.camera.type = params['type'];
            this.camTypeDropDownValue = params['type'];
            this.camera.source = params['source'];
            this.camera.fps = params['fps'];
            this.camFpsValue = params['fps'];
            this.camera.agent = params['agent'];
            if(params['camera_id'])
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
        if(model.vehicleTracking) this.camera.algo.push("vehicle_tracking");
        if(model.peopleTracking) this.camera.algo.push("person_tracking");
        console.log(this.camera.algo);
        //this.camera.algo = this.algoArr
        this.cameraService.add(this.camera)
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
                                this.router.navigate(['/supervisor/roi']);
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
