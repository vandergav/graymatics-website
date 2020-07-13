import { Component,Pipe, OnInit, ViewContainerRef, ViewEncapsulation , ElementRef , Renderer2 , ViewChild , AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {AlertService, 
        NotificationService,
        CameraService,
        VehicleService } from '../_services/index';
import { Vehicle } from '../_models/index';
import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'angular2-modal';
import { Modal, BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { Socket } from 'ng-socket-io';


@Component({
    moduleId: module.id.toString(),
    templateUrl: 'alerts.component.html',
    providers: [Modal]
})

export class AlertsComponent implements AfterViewInit {

    @ViewChild('vehicleRecognitionAddNewlistPopup') modelBtn : ElementRef;
    @ViewChild('vehicleNumbers') vnumbers: ElementRef;

    public vehicle : Vehicle;
    model: any = {};
    response: any = {};
    response2: any = {};
    response4: any = {};
    camDetails: any = {};
    currentUser: string;
    vehicle_list: any[] = [];
    cmaera_id :number;
    loading = false;
    saveBtn = false;
    deleteBtn = false;
    isRowActive:boolean = false; 
    numbers : any[] = [];
    n: number;
    edited_vehicle_list: string;
    edited_id: string;
    edited_list_name: string;
    edited_user_id: string;
    list_name_error: string;
    model_vehicle_number: string;
    
    constructor(
        private elRef:ElementRef,
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService,
        private renderer: Renderer2,
        private socket: Socket,
        private vehicleService: VehicleService,
        public modal: Modal) {
            this.currentUser = localStorage.getItem('currentUser');
        }

    ngAfterViewInit() {
        // vehicle model
        this.vehicle = {
            _id             : '',
            user_id         : '',
            list_name       : '',
            list_type       : '',
            vehicle_numbers : []
        }
        // get vehicle list
        this.vehicle_recongnition_list();

    }

    /**
     * Add new list
     */
    add_new_list(list_type:string, list_name: string, vehicle_numbers: string) {
        // empty check
        if(vehicle_numbers === "") this.list_name_error = "Please input the vehicle numbers";
        // set vehicle details
        this.numbers = [];
        this.numbers = vehicle_numbers.split(",");
        // empty the vehicle_numbers
        this.vehicle.vehicle_numbers = [];
        for(this.n = 0; this.n < this.numbers.length ; this.n++) {
            this.vehicle.vehicle_numbers.push(this.numbers[this.n]);
        }
        this.vehicle.list_type = list_type;
        this.vehicle.list_name = list_name;
        this.vehicle.user_id = localStorage.getItem('user_id');
        // call add list service
        this.vehicleService.add(this.vehicle)
            .subscribe(
                data => {
                    this.response = data;
                    if(this.response.status == 'error') {
                        this.list_name_error = this.response.message;
                        //this.alertService.error(this.response.message, true);
                    } else {
                        // close modal popup
                        this.modelBtn.nativeElement.click();
                        this.vnumbers.nativeElement.value = "";
                        //this.alertService.success(this.response.message, false);
                        this.vehicle_recongnition_list();
                    }
                }
            )   
    }

    vehicle_recongnition_list() {
        this.vehicleService.list_vehicle_recognition(localStorage.getItem('user_id'))
        .subscribe(
            data => {
                this.response4 = data;
                if(this.response4.status == 'error'){
                    this.alertService.error(this.response.message, true);
                }
                else if( this.response4.status == 'success'){
                    this.vehicle_list = this.response4.data;
                }
            },
            error => {
                alert("Server Error!");
                this.loading = false;
            });
    }

    edit_vehicle_numbers(vehicle_numbers:string,_id:string) {
        this.saveBtn = true;
        this.edited_vehicle_list = vehicle_numbers;
        this.edited_id = _id;
    }

    chagne_list_name(list_name:string,user_id:string,_id:string) {
        this.edited_list_name = list_name;
        this.edited_user_id = user_id;
        this.edited_id = _id;
        // populate the list name based vehicle numbers
        this.vehicleService.get_list_name(localStorage.getItem('user_id'),list_name)
        .subscribe(
            data => {
                this.response4 = data;
                if(this.response4.status == 'error'){
                    this.alertService.error(this.response4.message, true);
                }
                else if( this.response4.status == 'success'){
                    // populate the vehicle number in the input textbox
                    (<HTMLInputElement>document.getElementById(_id)).value = this.response4.data[0].vehicle_numbers;
                }
            },
            error => {
                alert("Server Error!");
                this.loading = false;
            });
    }

    select_row(_id:string) {
        this.edited_id = _id;
        this.isRowActive = !this.isRowActive;
        this.saveBtn = false;
        this.deleteBtn = true;
    }
    /**
     * Update list
     */
    save_edited_list() {
        this.vehicle._id = this.edited_id;
        this.vehicle.list_name = this.edited_list_name;
        this.vehicle.user_id = this.edited_user_id;
        // set vehicle details
        this.numbers = [];
        this.numbers = this.edited_vehicle_list.split(",");
        // empty the vehicle vehicle numbers array
        this.vehicle.vehicle_numbers = [];
        for(this.n = 0; this.n < this.numbers.length ; this.n++) {
            this.vehicle.vehicle_numbers.push(this.numbers[this.n]);
        }
        this.vehicleService.update(this.vehicle)
        .subscribe(
            data => {
                this.response = data;
                if(this.response.status == 'error') {
                    this.list_name_error = this.response.message;
                    //this.alertService.error(this.response.message, true);
                } else {
                    // close modal popup
                    this.modelBtn.nativeElement.click();
                    this.vnumbers.nativeElement.value = "";
                    //this.alertService.success(this.response.message, false);
                    this.vehicle_recongnition_list();
                }
            }
        )   
    }
    cancel_btn() {
        this.saveBtn = false;
        this.deleteBtn = false;
    }

    delete_list() {
        this.vehicleService.remove(this.edited_id)
        .subscribe(
            data => {
                this.response2 = data;
                if(this.response2.status == 'error') {
                    this.alertService.error(this.response2.message, true);
                } else {
                    // close modal popup
                    this.vehicle_recongnition_list();
                    this.deleteBtn = false;
                    // this.alertService.success(this.response2.message, true);
                }
            }
        )   
    }
}
