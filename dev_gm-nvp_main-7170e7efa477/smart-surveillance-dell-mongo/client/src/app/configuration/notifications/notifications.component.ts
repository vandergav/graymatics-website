import { Component,Pipe, OnInit, ViewContainerRef, ViewEncapsulation , ElementRef , Renderer2 , ViewChild , AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {AlertService, 
        NotificationService,
        CameraService,
        ConfigurationService,
        HomeService } from '../../_services/index';
import { ConfigNotification } from '../../_models/index';
import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'angular2-modal';
import { Modal, BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { Socket } from 'ng-socket-io';


@Component({
    moduleId: module.id.toString(),
    templateUrl: 'notifications.component.html',
    providers: [Modal]
})

export class NotificationsComponent implements AfterViewInit {

    @ViewChild('configNotificationModel') modelBtn : ElementRef;
    @ViewChild('mnmRule') mnmRule: ElementRef;
    @ViewChild('registrationNumberRule') registrationNumberRule: ElementRef;
    @ViewChild('vehicleCountRule') vehicleCountRule: ElementRef;
    @ViewChild('idRule') idRule: ElementRef;
    @ViewChild('vehicleCdRule') vehicleCdRule: ElementRef;
    @ViewChild('peopleRule') peopleRule: ElementRef;
    @ViewChild('rule') rule: ElementRef;

    public configNotification : ConfigNotification;
    nfn = { feature: '', dot:'', color:'' };
    cams: any[] = [];
    events: any[] = [];
    response: any = {};
    response2: any = {};
    response3: any = {};
    response4: any = {};
    response5: any = {};
    currentUser: string;
    cmaera_id :number;
    loading = false;
    saveBtn = false;
    deleteBtn = false;
    addBtn: boolean = true;
    savebtnrow : boolean = false;
    isRowActive:boolean = false; 
    selectedItem: string;
    edited_id: string;
    config_nfn_error: string;
    edited_feature : string;
    edited_dot : string;
    edited_rule : number;
    edited_color : string;
    edited_camera_id : string;

    constructor(
        private elRef:ElementRef,
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService,
        private renderer: Renderer2,
        private socket: Socket,
        private homeService: HomeService,
        private configurationService: ConfigurationService,
        public modal: Modal) {
            this.currentUser = localStorage.getItem('currentUser');
        }

    ngAfterViewInit() {
        // vehicle model
        this.configNotification = {
            _id     : '',
            user_id : '',
            camera_id   : '',
            feature : '',
            dot     : '',
            rule    : 0,
            color   : ''
        }
        // get cams list api
        this.get_camera_list();
        // get config notification list
        this.get_config_notifications();
    }

    select_row(_id:string) {
        this.edited_id = _id;
        this.isRowActive = !this.isRowActive;
        this.saveBtn = false;
        this.deleteBtn = true;
    }

    change_feature(feature:string) {
        console.log(feature);
        this.edited_feature = feature;
    }

    change_dot(dot:string) {
        console.log(dot);
        this.edited_dot = dot;
    }

    change_rule(rule:number) {
        console.log(rule);
        this.edited_rule = rule;
    }

    change_color(color:string) {
        console.log(color);
        this.edited_color = color;
    }

    tablerowselection(event: Event,index: string,_id:string,camera_id:string) {
        event.preventDefault();
        this.edited_id = _id;
        this.edited_camera_id = camera_id;
        this.selectedItem = index;
        this.isRowActive = true;
        this.savebtnrow = true;
        this.addBtn = false;
    }

    /**
     * update config details
     */
    update_config_notification() {
        // set config notification details
        this.configNotification._id = this.edited_id;
        this.configNotification.feature = this.edited_feature;
        this.configNotification.dot = this.edited_dot;
        this.configNotification.rule = this.edited_rule;
        this.configNotification.color = this.edited_color;
        this.configNotification.user_id = localStorage.getItem('user_id');
        this.configNotification.camera_id = this.edited_camera_id;
        // update api
        this.configurationService.update(this.configNotification)
            .subscribe(
                data => {
                    this.response5 = data;
                    if(this.response5.status == 'error') {
                        //this.alertService.error(this.response.message, true);
                    } else {
                        /**
                         * call notification list
                         */
                        this.get_config_notifications();
                        //this.alertService.success(this.response.message, false);
                    }
                }
            )   
    }

    cancelselection() {
        this.savebtnrow = false;
        this.isRowActive = false;
        this.addBtn = true;
    }
    /**
     * Get camera list using API
     */
    get_camera_list() {
        this.homeService.listCams()
        .subscribe(
            data => {
                this.response2 = data;
                if(this.response2.status == 'error') {
                    alert(this.response2.message);
                }
                else {
                    this.cams = this.response2.data;
                }
            }
        );
    }
    /**
     * get config_notification_list
     */
    get_config_notifications() {
        this.configurationService.listEvents()
        .subscribe(
            data => {
                this.response3 = data;
                if(this.response3.status == 'error') {
                    alert(this.response3.message);
                }
                else {
                    this.events = this.response3.data;
                }
            }
        );
    }
    /**
     * Add notification list
     */
    add_notification_list() {
        // set config notification details
        this.configNotification.feature = this.nfn.feature;
        this.configNotification.dot = this.nfn.dot;
        this.configNotification.user_id = localStorage.getItem('user_id');

        switch(this.nfn.color) {
            case 'PCgreen': {
                this.configNotification.color = 'green';
                this.configNotification.rule = this.peopleRule.nativeElement.value;
                break;
            }
            case 'PCyellow': {
                this.configNotification.color = 'yellow';
                this.configNotification.rule = this.peopleRule.nativeElement.value;
                break;
            }
            case 'PCred': {
                this.configNotification.color = 'red';
                this.configNotification.rule = this.peopleRule.nativeElement.value;
                break;
            }
            case 'CDgreen': {
                this.configNotification.color = 'green';
                this.configNotification.rule = this.vehicleCdRule.nativeElement.value;
                break;
            }
            case 'CDyellow': {
                this.configNotification.color = 'yellow';
                this.configNotification.rule = this.vehicleCdRule.nativeElement.value;
                break;
            }
            case 'CDred': {
                this.configNotification.color = 'red';
                this.configNotification.rule = this.vehicleCdRule.nativeElement.value;
                break;
            }
            case 'IDgreen': {
                this.configNotification.color = 'green';
                this.configNotification.rule = this.idRule.nativeElement.value;
                break;
            }
            case 'IDyellow': {
                this.configNotification.color = 'yellow';
                this.configNotification.rule = this.idRule.nativeElement.value;
                break;
            }
            case 'IDred': {
                this.configNotification.color = 'red';
                this.configNotification.rule = this.idRule.nativeElement.value;
                break;
            }
            case 'VCgreen': {
                this.configNotification.color = 'green';
                this.configNotification.rule = this.vehicleCountRule.nativeElement.value;
                break;
            }
            case 'VCyellow': {
                this.configNotification.color = 'yellow';
                this.configNotification.rule = this.vehicleCountRule.nativeElement.value;
                break;
            }
            case 'VCred': {
                this.configNotification.color = 'red';
                this.configNotification.rule = this.vehicleCountRule.nativeElement.value;
                break;
            }
            case 'RNgreen': {
                this.configNotification.color = 'green';
                this.configNotification.rule = this.registrationNumberRule.nativeElement.value;
                break;
            }
            case 'RNyellow': {
                this.configNotification.color = 'yellow';
                this.configNotification.rule = this.registrationNumberRule.nativeElement.value;
                break;
            }
            case 'RNred': {
                this.configNotification.color = 'red';
                this.configNotification.rule = this.registrationNumberRule.nativeElement.value;
                break;
            }
            case 'MMgreen': {
                this.configNotification.color = 'green';
                this.configNotification.rule = this.mnmRule.nativeElement.value;
                break;
            }
            case 'MMyellow': {
                this.configNotification.color = 'yellow';
                this.configNotification.rule = this.mnmRule.nativeElement.value;
                break;
            }
            case 'MMred': {
                this.configNotification.color = 'red';
                this.configNotification.rule = this.mnmRule.nativeElement.value;
                break;
            }
        }

        // validation for camera/notification selection 
        if( this.configNotification.camera_id == '' ||
            this.configNotification.feature == '' || 
            this.configNotification.dot == '' ||
            this.configNotification.rule == 0 ||
            this.configNotification.color == '' ) {
                this.config_nfn_error = "Fields shouldn't be empty.";
                return;
        }

        this.configurationService.add(this.configNotification)
            .subscribe(
                data => {
                    this.response = data;
                    if(this.response.status == 'error') {
                        this.config_nfn_error = this.response.message;
                        //this.alertService.error(this.response.message, true);
                    } else {
                        // close modal popup
                        this.modelBtn.nativeElement.click();
                        this.get_config_notifications();
                        // clear the ngModel values
                        this.nfn.feature = '';
                        this.nfn.dot = '';
                        this.nfn.color = '';
                        this.config_nfn_error = '';
                        //this.alertService.success(this.response.message, false);
                    }
                }
            )   
    }
    /**
     * select camera 
     * @param camera_id 
     */
    selected_cam(camera_id:string) {
        this.configNotification.camera_id = camera_id;
    }
    /**
     * delete notification using id
     */
    delete_config_notification() {
        this.configurationService.remove(this.edited_id)
        .subscribe(
            data => {
                this.response4 = data;
                if(this.response4.status == 'error') {
                    alert(this.response4.data);
                }
                else {
                    alert(this.response4.data);
                    /**
                     * call notification list
                     */
                    this.get_config_notifications();
                }
            }
        );
    }
}
