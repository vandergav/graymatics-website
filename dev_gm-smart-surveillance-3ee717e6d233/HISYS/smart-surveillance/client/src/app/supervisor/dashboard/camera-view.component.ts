import { Component, OnInit, ViewContainerRef, ViewEncapsulation , ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService,HomeService } from '../../_services/index';
import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'angular2-modal';
import { Modal, BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'camera-view.component.html',
    providers: [Modal]
})

export class CameraViewComponent implements OnInit {
    model: any = {};
    response: any = {};
    currentUser: string;
    loading = false;
    returnUrl: string;
    cams: any[]=[];
    
    constructor(
        private elRef:ElementRef,
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService,
        private homeService: HomeService,
        public modal: Modal) {
            this.currentUser = JSON.parse(localStorage.getItem('currentUser'));    
        }

    ngOnInit() {
        //call cameras
        this.cameras();
    }

    cameras() {
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

    view_camera_details(camera_id:number,user_id:number){
        this.router.navigate(['/supervisor/dashboard/single-camera-view'],{ queryParams: { camera_id : camera_id, user_id:user_id } });
    }
}
