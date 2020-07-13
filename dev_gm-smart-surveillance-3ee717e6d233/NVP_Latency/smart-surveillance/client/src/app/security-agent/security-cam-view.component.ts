import { Component, OnInit, ViewContainerRef, ViewEncapsulation , ElementRef , Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {AlertService, 
        NotificationService,
        CameraService } from '../_services/index';
import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'angular2-modal';
import { Modal, BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { Socket } from 'ng-socket-io';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'security-cam-view.component.html',
    providers: [Modal]
})

export class SecurityCamViewComponent implements OnInit {
    model: any = {};
    response: any = {};
    response1: any = {};
    red_border:boolean = false;
    green_border:boolean = false;
    yellow_border:boolean = false;
    red:boolean = false;
    green:boolean = false;
    yellow:boolean = false;
    red_count: any = {};
    red_action_count: any = {};
    green_count: any = {};
    green_action_count: any = {};
    yellow_count: any = {};
    yellow_action_count: any = {};
    response4: any = {};
    camDetails: any = {};
    currentUser: string;
    latestFrame: string;
    defaultLatestFrame: string;
    selectedItem: string;
    fullFrameSrc: string;
    hightlightStatus: Array<boolean> = [];
    latest_notification: any[] = [];
    notification_list: any[] = [];
    message: any = {};
    returnUrl: string;
    cmaera_id :number;
    loading = false;
    isParaActive:boolean = false;
    isBtnActive:boolean = false;
    size:boolean = false;
    all:boolean = false;
    frameBorder: boolean = false;
    
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
            this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        }

    ngOnInit() {
        // get query params from router
        this.route
        .queryParams
        .subscribe(params => {
            // Defaults to 0 if no query param provided.
            this.viewCamNotificatations(params['camera_id']);
        });
        //call socket message
        //this.getSocketMessage();
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }
    // toggle button 
    fullScreen(event: Event,frame:string){
        event.preventDefault();
        this.size = !this.size;
        this.all = !this.all;
        //add src to the big size div
        this.fullFrameSrc = frame;
    }
    // select frame
    selectFrame(event: Event,index: string,frame:string){
        event.preventDefault();
        this.selectedItem = index;
        this.latestFrame = frame;
    }
    //reset larget image to latest
    resetLargeImage(event: Event){
        event.preventDefault();
        this.latestFrame = this.defaultLatestFrame;
    }
    // toggle button 
    menuToggle(event: Event){
        event.preventDefault();
        this.isParaActive = !this.isParaActive;
        this.isBtnActive = !this.isBtnActive;
    }

    // get a message from server socket.io 
    getMessage() {
        return this.socket
            .fromEvent<any>("msg")
            .map(data => data.msg);
    }

    viewCamNotificatations(camera_id:number) {
        // assign notification id to update the nfn status
        this.cmaera_id = camera_id;
        // Get camera details
        this.cameraService.get(camera_id)
            .subscribe(
                data => {
                    this.response4 = data;
                    if(this.response4.status == 'error'){
                        this.alertService.error(this.response4.message, true);
                    }
                    else{
                        this.camDetails = this.response4.data[0];
                    }
                },
                error => {
                    alert("Server Error!");
                    this.loading = false;
                }
            )
        // red notiifcation count for today 
        this.notificationService.count('INTRUSION')
            .subscribe(
                data => {
                    this.red_count = data ;
                },
                error => {
                    console.log("error");
                }
        )
        // red notiifcation action count for today
        this.notificationService.action_count('INTRUSION')
            .subscribe(
                data => {
                    this.red_action_count = data ;
                },
                error => {
                    console.log("error");
                }
        )
        //green notiifcation count for today
        this.notificationService.count('People_Count')
            .subscribe(
                data => {
                    this.green_count = data ;
                },
                error => {
                    console.log("error");
                }
            )
        // green notiifcation action count for today
        this.notificationService.action_count('People_Count')
            .subscribe(
                data => {
                    this.green_action_count = data ;
                },
                error => {
                    console.log("error");
                }
            )
        //yellow notiifcation count for today
        this.notificationService.count('Vehicle_Count')
            .subscribe(
                data => {
                    this.yellow_count = data ;
                },
                error => {
                    console.log("error");
                }
            )
        // yellow notiifcation action count for today
        this.notificationService.action_count('Vehicle_Count')
            .subscribe(
                data => {
                    this.yellow_action_count = data ;
                },
                error => {
                    console.log("error");
                }
            )
        // get notification details based on id
        this.notificationService.getCamNotifications(camera_id)
            .subscribe(
                data => {
                    this.response = data;
                    if(this.response.status == 'error'){
                        this.alertService.error(this.response.message, true);
                        //alert(this.response.message);
                    }
                    else{
                        this.notification_list = this.response.data;
                        this.latestFrame = this.response.data[0].frame;
                        this.defaultLatestFrame = this.response.data[0].frame;
                    }
                },
                error => {
                    alert("Server Error!");
                    //console.log("data::"+JSON.stringify(error));
                    //this.alertService.error("server error");
                    this.loading = false;
                });
        // Get latest 50 notifications
        this.notificationService.latest()
            .subscribe(
                data => {
                    this.response1 = data;
                    this.latest_notification = this.response1.data;
                    // Empty the notification div before append
                    document.getElementById("1").innerHTML = "";
                    document.getElementById("2").innerHTML = "";
                    document.getElementById("3").innerHTML = "";
                    for(var l in this.latest_notification) {
                        // Append to red notification serction
                        if(this.latest_notification[l].type == 'INTRUSION') {
                            //Append red notification child
                            var div1 = document.createElement('div');
                                div1.className = 'red-notified-message notification-msg';
                                div1.id = this.latest_notification[l]._id;
                                div1.setAttribute("scene_id",this.latest_notification[l].scene_id);
                            this.renderer.listen(div1, 'click', (evt) => {
                                console.log('Clicking the button', evt.target.id);
                                this.router.navigate(['/notification/view'],{ queryParams: { scene_id : document.getElementById(evt.target.id).getAttribute('scene_id') , notification_id : evt.target.id } });
                            });    

                            var div2 = document.createElement('div');
                                if(this.latest_notification[l].status == 'complete')
                                    div2.className = 'seen';
                                else
                                    div2.className = 'info';
                                div2.style.pointerEvents = 'none';
                            var h5 = document.createElement('h5');
                                h5.innerHTML = this.latest_notification[l].camera_name;
                                h5.style.pointerEvents = 'none';
                           
                            var div3 = document.createElement('div');
                                div3.className = 'describtion-text';
                                div3.style.pointerEvents = 'none';
                            var p = document.createElement('p');
                                p.innerHTML = this.latest_notification[l].message;
                                p.style.pointerEvents = 'none';
                        
                            div2.appendChild(h5);
                            // div2.appendChild(span);
                            div3.appendChild(p);
                            div1.appendChild(div2);
                            div1.appendChild(div3);
                           // Adding notification to the red tab
                           document.getElementById("1").appendChild(div1);
                        }
                        if(this.latest_notification[l].type == 'Vehicle_Count') {
                            //Append green notification child
                            var div1 = document.createElement('div');
                                div1.className = 'yellow-notified-message notification-msg';
                                div1.id = this.latest_notification[l]._id;
                                div1.setAttribute("scene_id",this.latest_notification[l].scene_id);
                            this.renderer.listen(div1, 'click', (evt) => {
                                console.log('Clicking the button', evt.target.id);
                                this.router.navigate(['/notification/view'],{ queryParams: { scene_id : document.getElementById(evt.target.id).getAttribute('scene_id') , notification_id : evt.target.id } });
                            });    

                            var div2 = document.createElement('div');
                                if(this.latest_notification[l].status == 'complete')
                                    div2.className = 'seen';
                                else
                                    div2.className = 'info';
                                div2.style.pointerEvents = 'none';
                            var h5 = document.createElement('h5');
                                h5.innerHTML = this.latest_notification[l].camera_name;
                                h5.style.pointerEvents = 'none';
                            // var span = document.createElement('span');
                            //     span.innerHTML = this.latest_notification[l].timestamp;
                            //     span.style.pointerEvents = 'none';
                            var div3 = document.createElement('div');
                                div3.className = 'describtion-text';
                                div3.style.pointerEvents = 'none';
                            var p = document.createElement('p');
                                p.innerHTML = this.latest_notification[l].message;
                                p.style.pointerEvents = 'none';
                        
                            div2.appendChild(h5);
                            //div2.appendChild(span);
                            div3.appendChild(p);
                            div1.appendChild(div2);
                            div1.appendChild(div3);

                            document.getElementById("2").appendChild(div1);
                        }
                        // Adding green notication
                        if(this.latest_notification[l].type == 'People_Count') {
                            //Append green notification child
                            var div1 = document.createElement('div');
                                div1.className = 'green-notified-message notification-msg';
                                div1.id = this.latest_notification[l]._id;
                                div1.setAttribute("scene_id",this.latest_notification[l].scene_id);
                            this.renderer.listen(div1, 'click', (evt) => {
                                console.log('Clicking the button', evt.target.id);
                                this.router.navigate(['/notification/view'],{ queryParams: { scene_id : document.getElementById(evt.target.id).getAttribute('scene_id') , notification_id : evt.target.id } });
                            });    

                            var div2 = document.createElement('div');
                                if(this.latest_notification[l].status == 'complete')
                                    div2.className = 'seen';
                                else
                                    div2.className = 'info';
                                div2.style.pointerEvents = 'none';
                            var h5 = document.createElement('h5');
                                h5.innerHTML = this.latest_notification[l].camera_name;
                                h5.style.pointerEvents = 'none';
                            // var span = document.createElement('span');
                            //     span.innerHTML = this.latest_notification[l].timestamp;
                            //     span.style.pointerEvents = 'none';
                            var div3 = document.createElement('div');
                                div3.className = 'describtion-text';
                                div3.style.pointerEvents = 'none';
                            var p = document.createElement('p');
                                p.innerHTML = this.latest_notification[l].message;
                                p.style.pointerEvents = 'none';
                        
                            div2.appendChild(h5);
                            // div2.appendChild(span);
                            div3.appendChild(p);
                            div1.appendChild(div2);
                            div1.appendChild(div3);

                            document.getElementById("3").appendChild(div1);
                        }
                    }
                },
                error => {
                    console.log("error");
                }
            )    
    }

    getSocketMessage(){
        this.getMessage()
            .subscribe(message => {
                this.message = message;
                //console.log(this.message);
                if(this.message.notification_type == 'People_Count'){
                    // green notiifcation count for today
                    this.notificationService.count('People_Count')
                        .subscribe(
                            data => {
                                this.green_count = data ;
                            },
                            error => {
                                console.log("error");
                            }
                        )
                    //Append red notification child
                    var div1 = document.createElement('div');
                        div1.className = 'green-notified-message notification-msg';
                        div1.id = this.message.notification_id;
                        this.renderer.listen(div1, 'click', (evt) => {
                            console.log('Clicking the button', evt.target.id);
                            this.viewCamNotificatations(evt.target.id);
                            this.router.navigate(['/notification/view'],{ queryParams: { notification_id : evt.target.id } });
                        });    
                    
                    var div2 = document.createElement('div');
                        div2.className = 'info';
                        div2.style.pointerEvents = 'none';
                    var h5 = document.createElement('h5');
                        h5.innerHTML = this.message.cam_name;
                        h5.style.pointerEvents = 'none';
                    var span = document.createElement('span');
                        span.innerHTML = this.message.time_stamp;
                        span.style.pointerEvents = 'none';
                    var div3 = document.createElement('div');
                        div3.className = 'describtion-text';
                        div3.style.pointerEvents = 'none';
                    var p = document.createElement('p');
                        p.innerHTML = this.message.notification_text;
                        p.style.pointerEvents = 'none';
                    
                    div2.appendChild(h5);
                    div2.appendChild(span);
                    div3.appendChild(p);
                    div1.appendChild(div2);
                    div1.appendChild(div3);
                    
                    var green_div = document.getElementById("3");
                    green_div.insertBefore(div1, green_div.childNodes[0]);
                }
            });
    }
}
