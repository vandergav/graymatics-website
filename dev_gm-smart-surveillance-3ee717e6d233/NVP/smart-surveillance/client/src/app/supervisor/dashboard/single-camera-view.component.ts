import { Component, OnInit, ViewContainerRef, ViewEncapsulation , ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {    AlertService, 
            NotificationService,
            CameraService } from '../../_services/index';
import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'angular2-modal';
import { Modal, BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'single-camera-view.component.html',
    providers: [Modal]
})

export class SingleCameraViewComponent implements OnInit {
    model: any = {};
    response: any = {};
    currentUser: string;
    loading = false;
    returnUrl: string;
    response1: any = {};
    response2: any = {};
    response3: any = {};
    response4: any = {};
    camDetails: any = {};
    notification_list: any[] = [];

    
    constructor(
        private elRef:ElementRef,
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService,
        private notificationService: NotificationService,
        private cameraService: CameraService,
        public modal: Modal) { 
            this.currentUser = localStorage.getItem('currentUser');
        }

    ngOnInit() {
        // get query params from router
        this.route
        .queryParams
        .subscribe(params => {
            // Defaults to 0 if no query param provided.
            this.viewCamNotificatations(params['_id'],params['user_id']);
        });    
    }

    main() {
        
    }

    viewCamNotificatations(_id:string,user_id:string) {
        // Get camera details
        this.cameraService.get(_id)
            .subscribe(
                data => {
                    this.response1 = data;
                    if(this.response1.status == 'error'){
                        this.alertService.error(this.response1.message, true);
                    }
                    else{
                        this.camDetails = this.response1.data[0];
                    }
                },
                error => {
                    alert("Server Error!");
                    this.loading = false;
                }
            )
        // notiifcation count for today
        // this.notificationService.count()
        //     .subscribe(
        //         data => {
        //             this.response2 = data ;
        //         },
        //         error => {
        //             console.log("error");
        //         }
        //     )
        // notiifcation action count for today
        // this.notificationService.action_count()
        //     .subscribe(
        //         data => {
        //             this.response3 = data ;
        //         },
        //         error => {
        //             console.log("error");
        //         }
        //     )
         // get notification details based on id
        this.notificationService.getCamNotifications(_id,'camera')
            .subscribe(
                data => {
                    this.response4 = data;
                    if(this.response4.status == 'error'){
                        this.alertService.error(this.response4.message, true);
                        //alert(this.response.message);
                    }
                    else{
                        this.notification_list = this.response4.data;
                    }
                },
                error => {
                    alert("Server Error!");
                    //console.log("data::"+JSON.stringify(error));
                    //this.alertService.error("server error");
                    this.loading = false;
                });
    }
}
