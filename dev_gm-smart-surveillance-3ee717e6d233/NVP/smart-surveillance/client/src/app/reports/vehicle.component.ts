import { Component,Pipe, OnInit, ViewContainerRef, ViewEncapsulation , ElementRef , Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {AlertService, 
        NotificationService,
        CameraService } from '../_services/index';
import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'angular2-modal';
import { Modal, BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { Socket } from 'ng-socket-io';


@Component({
    moduleId: module.id.toString(),
    templateUrl: 'vehicle.component.html',
    providers: [Modal]
})

export class VehicleComponent implements OnInit {
    model: any = {};
    response: any = {};
    response4: any = {};
    camDetails: any = {};
    currentUser: string;
    notification_list: any[] = [];
    cmaera_id :number;
    loading = false;
    
    constructor(
        private elRef:ElementRef,
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService,
        private renderer: Renderer2,
        private notificationService: NotificationService,
        private cameraService: CameraService,
        private socket: Socket,
        public modal: Modal) {
            this.currentUser = localStorage.getItem('currentUser');
        }

    ngOnInit() {
        this.getLatestNotifications();
    }
    getLatestNotifications() {
        // get notification details based on id
        this.notificationService.vehicle_report()
            .subscribe(
                data => {
                    this.response = data;
                    if(this.response.status == 'error'){
                        this.alertService.error(this.response.message, true);
                        //alert(this.response.message);
                    }
                    else{
                        this.notification_list = this.response.data;
                    }
                },
                error => {
                    alert("Server Error!");
                    this.loading = false;
                });
    }
}
