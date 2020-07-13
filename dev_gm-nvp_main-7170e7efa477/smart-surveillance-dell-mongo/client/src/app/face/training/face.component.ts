import { Component,Pipe, OnInit, ViewContainerRef, ViewEncapsulation , ElementRef , Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {AlertService, 
        NotificationService,
        CameraService,
        FaceService } from '../../_services/index';
import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'angular2-modal';
import { Modal, BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { Socket } from 'ng-socket-io';


@Component({
    moduleId: module.id.toString(),
    templateUrl: 'face.component.html',
    providers: [Modal]
})

export class FaceComponent implements OnInit {
    model: any = {};
    response: any = {};
    response4: any = {};
    camDetails: any = {};
    currentUser: string;
    face_list: any[] = [];
    cmaera_id :number;
    loading = false;
    
    constructor(
        private elRef:ElementRef,
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService,
        private renderer: Renderer2,
        private socket: Socket,
        private faceService: FaceService,
        public modal: Modal) {
            this.currentUser = localStorage.getItem('currentUser');
        }

    ngOnInit() {
        // get frame from face subject router
        this.faceList();
    }
    /**
     * Face list
     */
    faceList() {
        this.faceService.list_face(localStorage.getItem('user_id'))
        .subscribe(
            data => {
                this.response4 = data;
                if(this.response4.status == 'error'){
                    this.alertService.error(this.response.message, true);
                }
                else if( this.response4.status == 'success'){
                    this.face_list = this.response4.data;
                }
            },
            error => {
                alert("Server Error!");
                this.loading = false;
            });
    }

    faceView(face:any) {
        this.router.navigate(['/face/training/add'],{ queryParams: { face_id : face._id , subject_type : face.subject_type, name : face.name , age : face.age , gender : face.gender , ethnicity : face.ethnicity  } });
    }

    // get a message from server socket.io 
    getMessage() {
        return this.socket
            .fromEvent<any>("msg")
            .map(data => data.msg);
    }
    // send a message to server socket.io 
    sendMessage(msg: string) {
        this.socket
            .emit("msg", msg);
    }
}
