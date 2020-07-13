import { Component, OnInit, ViewContainerRef, ViewEncapsulation , ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService , HomeService, VideoService } from '../../_services/index';
import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'angular2-modal';
import { Modal, BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { Socket } from 'ng-socket-io';
import { Camera } from '../../_models/index';
import { StartCamera } from '../../_models/index';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'archived_video.component.html',
    providers: [Modal]
})

export class ArchivedVideo implements OnInit {
    public startCamera: StartCamera;
    model: any = {};
    toggle = {};
    status_toggle = {};
    response: any = {};
    response4: any = {};
    gray_video_id : string;
    videos: any[] = [];
    vidName: string;
    currentUser: string;
    loading = false;
    saveBtn = false;
    deleteBtn = false;
    addVideoBtn = true;
    returnUrl: string;
    agent_dd_val: string;
    status_dd_val: string;
    video_name_val: string;

    message: any = {};
    isBig:boolean = false;
    full_screen_view: string;
    full_screen_cam_id: string;
    full_screen_cam_name: string;
    
    constructor(
        private elRef:ElementRef,
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService,
        private homeService:HomeService,
        private videoService: VideoService,
        public modal: Modal,
        private socket: Socket) { 
            this.currentUser = localStorage.getItem('currentUser');
        }

    ngOnInit() {
        this.video_list();
        // init the start camera model
        this.startCamera = {
            _id: '',
            user_id: '',
            name:'',
            source: '',
            protocol:'',
            interface:'',
            fps:'',
            algos:[''],
            port:'',
            roi: [''],
            media_type:''
        }
    }
    selected_value(id:string,value:string){
        this.gray_video_id = id.split("_")[1];
        this.saveBtn = true;
        this.addVideoBtn = false;
        document.getElementById(id).innerHTML = value;
        if(id.split("_")[0] == 'agent')
        this.agent_dd_val = value;
        if(id.split("_")[0] == 'status')
        this.status_dd_val = value;
    }

    view_video(camera_id: string){
        this.router.navigate(['/security-agent/video/view'],{ queryParams: { _id : camera_id, media_type: 'video' } });
    }

    video_id(){
        // show delete button 
        this.deleteBtn = true;
        this.addVideoBtn = false;
        this.saveBtn = false;
    }
    change_cam_name(tb_value:string,tb_id:string){
        this.saveBtn = true;
        this.addVideoBtn = false;
        this.video_name_val = tb_value;
        this.gray_video_id = tb_id.split('_')[1];
        console.log("value:::::"+tb_value);
    }
    cancelselection(){
        this.addVideoBtn = true;
        this.deleteBtn = false;
        this.saveBtn = false;
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
    goto_edit_video(video_details:any){
        this.router.navigate(['/security-agent/video/add'],
            { queryParams: 
                {   camera_id : video_details.camera_id, 
                    user_id : video_details.user_id,
                    name: video_details.name, 
                    type : video_details.type, 
                    source:video_details.source, 
                    fps: video_details.fps , 
                    agent:video_details.agent 
                } 
            }
        );
    }
    video_list() {
        // call list of cameras api
        this.videoService.listVideos()
            .subscribe(
                data => {
                    this.response = data;
                    if(this.response.status == 'error'){
                        alert(this.response.message);
                    }
                    else{
                        this.videos = this.response.data;
                        // start the videos which are not processed
                        for(var s=0; s < this.videos.length ; s++) {
                            // set camera details
                            this.startCamera.user_id = this.videos[s].user_id;
                            this.startCamera._id = this.videos[s]._id;
                            this.startCamera.name = this.videos[s].name;
                            this.startCamera.port = "80";
                            this.startCamera.source = this.videos[s].source;
                            this.startCamera.protocol = this.videos[s].protocol;
                            this.startCamera.interface = this.videos[s].interface;
                            this.startCamera.roi = this.videos[s].roi;
                            this.startCamera.fps = this.videos[s].fps;
                            this.startCamera.algos = this.videos[s].algo;
                            this.startCamera.media_type = "video";
                            //start cameras
                            if( this.videos[s].status == 'processing' ) {
                                this.homeService.start(this.startCamera)
                                .subscribe(
                                    data => {
                                        this.response4 = data;
                                        if(this.response4.status == 'error'){
                                            alert(this.response4.message);
                                        }else {
                                            /*
                                            this.camera.camera_id = 5;
                                            this.camera.status = "running";
                                            this.cameraService.update(this.camera)
                                                .subscribe(
                                                    data => {
                                                        //updated
                                                    },
                                                    error => {
                                                        //error
                                                    }
                                                )
                                            */
                                        }
                                    },
                                    error => {
                                        console.log("error");
                                    }
                                );
                            }
                        }
                        // Get socket messages    
                        this.getMessage()
                        .subscribe(message => {
                            this.message = message;
                            // console.log(this.message);
                            if(typeof this.message.cam_id != 'undefined' && typeof this.message.frame_src != 'undefined'){
                                if(typeof this.message.frame_src != 'undefined' && this.message.frame_src != null)
                                    document.getElementById('frame_'+this.message.cam_id).setAttribute("src",this.message.frame_src);
                                else
                                    document.getElementById('frame_'+this.message.cam_id).setAttribute("src","https://s3.amazonaws.com/2g3c-codes/no-feed.jpg");
                                if(this.isBig == true && this.message.cam_id == this.full_screen_cam_id)
                                this.full_screen_view = this.message.frame_src;
                            }
                        })
                    }
                
                },
                error => {
                    alert("Server Error!");
                    this.loading = false;    
                }
            )
    }

    update_camera(){
        this.model.camera_id = +this.gray_video_id;
        this.model.agent = this.agent_dd_val;
        this.model.status = this.status_dd_val;
        this.model.name = this.video_name_val;
        console.log(this.model.name);
        this.videoService.update(this.model)
            .subscribe(
                data => {
                    //this.alertService.success('Registration successful', true);
                    this.response = data;
                    if(this.response.status == 'error'){
                        //this.alertService.error(this.response.message, true);
                        var msg = this.response.message.replace(/\\/g, "");
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

    delete_camera(_id:string){
        this.videoService.remove(_id)
            .subscribe(
                data => {
                    this.response = data;
                    if(this.response.status == 'error'){
                        //this.alertService.error(this.response.message, true);
                        alert(this.response.message);
                    }
                    else{
                        // Remove camera from ui
                        document.getElementById("video_"+_id).remove();
                        const dialog =   this.modal.alert()
                                        .size('sm')
                                        .body(this.response.message)
                                        .open();
                    }
                },
                error => {
                    alert("Server Error!");
                    this.loading = false;
                });
    }
}
