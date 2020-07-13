import { Component, OnInit, ViewContainerRef, ViewEncapsulation , ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService , HomeService, CameraService } from '../../_services/index';
import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'angular2-modal';
import { Modal, BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { Camera } from '../../_models/index';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'main.component.html',
    providers: [Modal]
})

export class MainComponent implements OnInit {
    model: any = {};
    toggle = {};
    status_toggle = {};
    response: any = {};
    gray_cam_id : string;
    cams: any[] = [];
    camName: string;
    currentUser: string;
    loading = false;
    saveBtn = false;
    deleteBtn = false;
    addCameraBtn = true;
    returnUrl: string;
    agent_dd_val: string;
    status_dd_val: string;
    camera_name_val: string;

    constructor(
        private elRef:ElementRef,
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService,
        private homeService:HomeService,
        private cameraService: CameraService,
        public modal: Modal) { 
            this.currentUser = localStorage.getItem('currentUser');
        }

    ngOnInit() {
        this.camera_list();
    }
    selected_value(id:string,value:string){
        this.gray_cam_id = id.split("_")[1];
        this.saveBtn = true;
        this.addCameraBtn = false;
        document.getElementById(id).innerHTML = value;
        if(id.split("_")[0] == 'agent')
        this.agent_dd_val = value;
        if(id.split("_")[0] == 'status')
        this.status_dd_val = value;
    }

    camera_id(){
        // show delete button 
        this.deleteBtn = true;
        this.addCameraBtn = false;
        this.saveBtn = false;
    }
    change_cam_name(tb_value:string,tb_id:string){
        this.saveBtn = true;
        this.addCameraBtn = false;
        this.camera_name_val = tb_value;
        this.gray_cam_id = tb_id.split('_')[1];
        console.log("value:::::"+tb_value);
    }
    cancelselection(){
        this.addCameraBtn = true;
        this.deleteBtn = false;
        this.saveBtn = false;
    }
    goto_edit_camera(camera_details:any){
        this.router.navigate(['/supervisor/camera/add'],
            { queryParams: 
                {   camera_id : camera_details.camera_id, 
                    user_id : camera_details.user_id,
                    name: camera_details.name, 
                    type : camera_details.type, 
                    source:camera_details.source, 
                    fps: camera_details.fps , 
                    agent:camera_details.agent 
                } 
            }
        );
    }
    camera_list() {
        // call list of cameras api
        this.homeService.listCams()
            .subscribe(
                data => {
                    this.response = data;
                    if(this.response.status == 'error'){
                        alert(this.response.message);
                    }
                    else{
                        this.cams = this.response.data;
                    }
                
                },
                error => {
                    alert("Server Error!");
                    this.loading = false;    
                }
            )
    }

    update_camera(){
        this.model.camera_id = +this.gray_cam_id;
        this.model.agent = this.agent_dd_val;
        this.model.status = this.status_dd_val;
        this.model.name = this.camera_name_val;
        console.log(this.model.name);
        this.cameraService.update(this.model)
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

    delete_camera(){
        console.log(this.gray_cam_id);
        this.cameraService.remove(this.gray_cam_id)
            .subscribe(
                data => {
                    this.response = data;
                    if(this.response.status == 'error'){
                        //this.alertService.error(this.response.message, true);
                        alert(this.response.message);
                    }
                    else{
                        // Remove camera from ui
                        document.getElementById("GRAY_"+this.gray_cam_id).remove();
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
                    alert("Server Error!");
                    this.loading = false;
                });
    }
}
