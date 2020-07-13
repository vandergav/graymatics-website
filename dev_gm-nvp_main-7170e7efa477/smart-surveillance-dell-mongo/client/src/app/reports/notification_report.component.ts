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
    templateUrl: 'notification_report.component.html',
    providers: [Modal]
})

export class NotificationReportComponent implements OnInit {
    model: any = {};
    response: any = {};
    response4: any = {};
    camDetails: any = {};
    currentUser: string;
    notification_list: any[] = [];
    cmaera_id :number;
    loading = false;
    red_count: any = {};
    red_action_count: any = {};
    green_count: any = {};
    green_action_count: any = {};
    yellow_count: any = {};
    yellow_action_count: any = {};
    today: Date = new Date();

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
        this.getNotificationCount();
    }
    getNotificationCount() {
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
        }
}
