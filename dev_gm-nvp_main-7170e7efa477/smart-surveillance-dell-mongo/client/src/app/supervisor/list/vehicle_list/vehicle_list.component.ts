import { Component,Pipe, OnInit, ViewContainerRef, ViewEncapsulation , ElementRef , Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {AlertService, 
        NotificationService,
        CameraService,
        FaceService } from '../../../_services/index';
import { Camera } from '../../../_models/index';
import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'angular2-modal';
import { Modal, BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { Socket } from 'ng-socket-io';


@Component({
    moduleId: module.id.toString(),
    templateUrl: 'vehicle_list.component.html',
    providers: [Modal]
})

export class VehicleListComponent implements OnInit {
    public camera: Camera;
    model: any = {};
    response: any = {};
    response4: any = {};
    camDetails: any = {};
    currentUser: string;
    face_list: any[] = [];
    cmaera_id :number;
    loading = false;
    saveBtn = false;
    deleteBtn = false;
    isRowActive:boolean = false; 

    constructor(
        private elRef:ElementRef,
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService,
        private renderer: Renderer2,
        private cameraService: CameraService,
        public modal: Modal) {
            this.currentUser = localStorage.getItem('currentUser');
        }

    ngOnInit() {
        // get frame from face subject router
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
            source: '',
            roi: [''],
            frame: '',
            fps:'',
            gps: '',
            status:'',
            protocol: '',
            interface: '',
            agent:'',
            media_type: '',
            algo : [''],
            people_whitelist: '',
            people_blacklist: '',
            vehicle_whitelist: '',
            vehicle_blacklist: ''
        }
    }
    
    submitVehicleList() {
        this.camera.vehicle_whitelist = (<HTMLElement>document.getElementById("vehicle_whitelist")).textContent;
        this.camera.vehicle_blacklist = (<HTMLElement>document.getElementById("vehicle_blacklist")).textContent;
        this.camera._id = (<HTMLInputElement>document.getElementById("camera_id")).value;
        this.cameraService.update(this.camera)
        .subscribe(
            data => {
                //this.alertService.success('Registration successful', true);
                this.response = data;
                if(this.response.status == 'error'){
                      this.alertService.error(this.response.message, true);
                }
                else{
                    // console.log(this.response);
                    const dialog =   this.modal.alert()
                                    .size('sm')
                                    .body(this.response.message)
                                    .open();
                     dialog                    
                    .catch((err: any) => console.log('ERROR: ' + err))
                    .then((dialog: any) => { return dialog.result })
                    .then((result: any) => { 
                        // this.router.navigate(['/']);
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

    show_save_btn() {
        this.saveBtn = true;
    }

    select_row() {
        this.isRowActive = !this.isRowActive;
        this.deleteBtn = true;
    }

    cancel_btn() {
        this.saveBtn = false;
        this.deleteBtn = false;
    }
}
