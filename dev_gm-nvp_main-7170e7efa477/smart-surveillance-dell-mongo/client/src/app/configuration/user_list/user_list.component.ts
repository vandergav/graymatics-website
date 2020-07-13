import { Component,Pipe, OnInit, ViewContainerRef, ViewEncapsulation , ElementRef , Renderer2 , ViewChild , AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {AlertService, 
        NotificationService,
        CameraService,
        ConfigurationService,
        HomeService } from '../../_services/index';
import { ConfigUserList } from '../../_models/index';
import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'angular2-modal';
import { Modal, BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { Socket } from 'ng-socket-io';


@Component({
    moduleId: module.id.toString(),
    templateUrl: 'user_list.component.html',
    providers: [Modal]
})

export class UserListComponent implements AfterViewInit {

    @ViewChild('userListPopup') modelBtn : ElementRef;
    @ViewChild('mnmRule') mnmRule: ElementRef;
    @ViewChild('registrationNumberRule') registrationNumberRule: ElementRef;
    @ViewChild('vehicleCountRule') vehicleCountRule: ElementRef;
    @ViewChild('idRule') idRule: ElementRef;
    @ViewChild('vehicleCdRule') vehicleCdRule: ElementRef;
    @ViewChild('peopleRule') peopleRule: ElementRef;
    @ViewChild('rule') rule: ElementRef;

    public configUserList : ConfigUserList;
    cams: any[] = [];
    users: any[] = [];
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
    config_user_error: string;
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
        this.configUserList = {
            name            : '',
            email           : '',
            mobile_number   : '',
            assign_list     : false,
            share_list      : false,
            escalation_list : false
        }
        // get cams list api
        this.get_camera_list();
        // get config notification list
        this.get_config_user_list();
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
    update_user_list( name:string, email:string, mobile_number:string,assign_list:boolean,share_list:boolean,escalation_list:boolean) {
        console.log(name,email,mobile_number,assign_list,share_list,escalation_list);
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
    get_config_user_list() {
        this.configurationService.listUsers()
        .subscribe(
            data => {
                this.response3 = data;
                if(this.response3.status == 'error') {
                    alert(this.response3.message);
                }
                else {
                    this.users = this.response3.data;
                }
            }
        );
    }
    /**
     * Add notification list
     */
    add_user_list( name:string, email:string, mobile_number:string,assign_list:boolean,share_list:boolean,escalation_list:boolean) {
        console.log(name,email,mobile_number,assign_list,share_list,escalation_list);
        // input validation check
        if( name == '' ||
            email == '' || 
            mobile_number == '') {
                this.config_user_error = "Fields shoudn't be empty";
                return;
            }
        // Setup the user list data
        this.configUserList.name = name;
        this.configUserList.email = email;
        this.configUserList.mobile_number = mobile_number;
        this.configUserList.assign_list = assign_list;
        this.configUserList.share_list = share_list;
        this.configUserList.escalation_list = escalation_list;

        // Add user list
        this.configurationService.add_user_list(this.configUserList)
            .subscribe(
                data => {
                    this.response = data;
                    if(this.response.status == 'error') {
                        this.config_user_error = this.response.message;
                        //this.alertService.error(this.response.message, true);
                    } else {
                        // close modal popup
                        this.modelBtn.nativeElement.click();
                        this.get_config_user_list();
                        // clear the ngModel values
                        this.config_user_error = '';
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
                     * call user list
                     */
                    this.get_config_user_list();
                }
            }
        );
    }
}
