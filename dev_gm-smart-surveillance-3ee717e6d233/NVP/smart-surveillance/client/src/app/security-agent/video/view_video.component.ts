import { Component, OnInit, ViewContainerRef, ViewEncapsulation , ElementRef , Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {    AlertService, 
            NotificationService,
            VideoService,
            HomeService } from '../../_services/index';
import { StartCamera } from '../../_models/index';
import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'angular2-modal';
import { Modal, BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { Socket } from 'ng-socket-io';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'view_video.component.html',
    providers: [Modal]
})

export class ViewVideoComponent implements OnInit {
    public startCamera: StartCamera;
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
    videoDetails: any = {};
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
    video_id :string;
    loading = false;
    isParaActive:boolean = false;
    isBtnActive:boolean = false;
    size:boolean = false;
    all:boolean = false;
    frameBorder: boolean = false;
    keyword:string;
    media_type: string;
    
    constructor(
        private elRef:ElementRef,
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService,
        private renderer: Renderer2,
        private notificationService: NotificationService,
        private videoService: VideoService,
        private socket: Socket,
        private homeService: HomeService,
        public modal: Modal) {
            this.currentUser = localStorage.getItem('currentUser');
        }

    ngOnInit() {
         // Activate green notification border 
         this.green = true;
         this.green_border = true;
        // get query params from router
        this.route
        .queryParams
        .subscribe(params => {
            // Defaults to 0 if no query param provided.
            this.media_type = params['media_type'];
            this.viewCamNotificatations(params['_id']);
        });

        this.startCamera = {
            _id:'',
            user_id:'',
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
        //call socket message
        // this.getSocketMessage();
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

    // send a message to server socket.io 
    sendMessage(msg: string) {
        this.socket
            .emit("msg", msg);
    }

    viewCamNotificatations(video_id:string) {
        console.log("video_id",video_id);
        // assign notification id to update the nfn status
        this.video_id = video_id;
        // Get camera details
        this.videoService.get(video_id)
            .subscribe(
                data => {
                    this.response4 = data;
                    if(this.response4.status == 'error'){
                        this.alertService.error(this.response4.message, true);
                    }
                    else{
                        this.videoDetails = this.response4.data[0];
                        //start cameras
                        // set camera details
                        // this.startCamera.user_id = this.videoDetails.user_id;
                        // this.startCamera.camera_id = this.videoDetails.camera_id;
                        // this.startCamera.name = this.videoDetails.name;
                        // this.startCamera.port = "80";
                        // this.startCamera.source = this.videoDetails.source;
                        // this.startCamera.protocol = this.videoDetails.protocol;
                        // this.startCamera.interface = this.videoDetails.interface;
                        // this.startCamera.roi = this.videoDetails.roi;
                        // this.startCamera.fps = this.videoDetails.fps;
                        // this.startCamera.algos = this.videoDetails.algo;
                        // this.startCamera.media_type = "video";
                        // this.homeService.start(this.startCamera)
                        // .subscribe(
                        //     data => {
                        //         this.response4 = data;
                        //         if(this.response4.status == 'error'){
                        //             alert(this.response4.message);
                        //         }else {
                        //             // this.getSocketMessage();
                        //         }
                        //     },
                        //     error => {
                        //         console.log("error");
                        //     }
                        // );
                    }
                },
                error => {
                    alert("Server Error!");
                    this.loading = false;
                }
            )
        // red notiifcation count for today 
        this.notificationService.count('INTRUSION','video')
            .subscribe(
                data => {
                    this.red_count = data ;
                },
                error => {
                    console.log("error");
                }
        )
        // red notiifcation action count for today
        this.notificationService.action_count('INTRUSION','video')
            .subscribe(
                data => {
                    this.red_action_count = data ;
                },
                error => {
                    console.log("error");
                }
        )
        //green notiifcation count for today
        this.notificationService.count('People_Count','video')
            .subscribe(
                data => {
                    this.green_count = data ;
                },
                error => {
                    console.log("error");
                }
            )
        // green notiifcation action count for today
        this.notificationService.action_count('People_Count','video')
            .subscribe(
                data => {
                    this.green_action_count = data ;
                },
                error => {
                    console.log("error");
                }
            )
        //yellow notiifcation count for today
        this.notificationService.count('Vehicle_Count','video')
            .subscribe(
                data => {
                    this.yellow_count = data ;
                },
                error => {
                    console.log("error");
                }
            )
        // yellow notiifcation action count for today
        this.notificationService.action_count('Vehicle_Count','video')
            .subscribe(
                data => {
                    this.yellow_action_count = data ;
                },
                error => {
                    console.log("error");
                }
            )
        // get notification details based on id
        this.notificationService.getCamNotifications(video_id,'video')
            .subscribe(
                data => {
                    this.response = data;
                    if(this.response.status == 'error'){
                        this.alertService.error(this.response.message, true);
                        //alert(this.response.message);
                    }
                    else{
                        this.notification_list = this.response.data;
                        // this.latestFrame = this.response.data[0].frame;
                        // this.defaultLatestFrame = this.response.data[0].frame;
                    }
                },
                error => {
                    alert("Server Error!");
                    //console.log("data::"+JSON.stringify(error));
                    //this.alertService.error("server error");
                    this.loading = false;
                });
        // Get latest 50 notifications
        this.notificationService.latest("video")
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
                                this.router.navigate(['/notification/view'],{ queryParams: {
                                     scene_id : document.getElementById(evt.target.id).getAttribute('scene_id') , 
                                     notification_id : evt.target.id,
                                     media_type : 'video' } });
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
                                this.router.navigate(['/notification/view'],{ queryParams: { 
                                    scene_id : document.getElementById(evt.target.id).getAttribute('scene_id') , 
                                    notification_id : evt.target.id,
                                    media_type : 'video' } });
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
                                this.router.navigate(['/notification/view'],{ queryParams: { 
                                    scene_id : document.getElementById(evt.target.id).getAttribute('scene_id') , 
                                    notification_id : evt.target.id, 
                                    media_type : 'video' 
                                } });
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
            /**
             * Start socket 
             */
            this.getMessage()
            .subscribe(message => {
                this.message = message;
                console.log(this.message.cam_id);
                if(typeof this.message.cam_id != 'undefined' && typeof this.message.frame_src != 'undefined'){
                    if(typeof this.message.frame_src != 'undefined' && this.message.frame_src != null)
                        document.getElementById("frame_"+this.message.cam_id).setAttribute("src",this.message.frame_src);
                    else
                        document.getElementById("frame_"+this.message.cam_id).setAttribute("src","https://s3.amazonaws.com/2g3c-codes/no-feed.jpg");
                    // if(this.isBig == true && this.message.cam_id == this.full_screen_cam_id)
                    // this.full_screen_view = this.message.frame_src;
                }
                // INTRUSION count algo 
                if(this.message.notification_type == 'INTRUSION'){
                    // Activate red notification section
                    this.yellow = false;
                    this.red = true;
                    this.green = false;
                    // Activate red border notification section
                    this.yellow_border = false;
                    this.red_border = true;
                    this.green_border = false;
                    // notiifcation count for today
                    this.notificationService.count('INTRUSION','video')
                        .subscribe(
                            data => {
                                this.red_count = data ;
                            },
                            error => {
                                console.log("error");
                            }
                        )

                    //Append green notification child
                    var div1 = document.createElement('div');
                        div1.className = 'red-notified-message notification-msg';
                        div1.id = this.message.notification_id;
                        div1.setAttribute("scene_id",this.message.scene_id);
                    this.renderer.listen(div1, 'click', (evt) => {
                        console.log('Clicking the button', evt.target.id);
                        this.router.navigate(['/notification/view'],{ queryParams: { 
                            scene_id : document.getElementById(evt.target.id).getAttribute('scene_id') , 
                            notification_id : evt.target.id, 
                            media_type : 'video' 
                        } });
                    });    

                    var div2 = document.createElement('div');
                        div2.className = 'info';
                        div2.style.pointerEvents = 'none';
                    var h5 = document.createElement('h5');
                        h5.innerHTML = this.message.cam_name;
                        h5.style.pointerEvents = 'none';
                   
                    var div3 = document.createElement('div');
                        div3.className = 'describtion-text';
                        div3.style.pointerEvents = 'none';
                    var p = document.createElement('p');
                        p.innerHTML = this.message.notification_text;
                        p.style.pointerEvents = 'none';
                   
                    div2.appendChild(h5);
                    // div2.appendChild(span);
                    div3.appendChild(p);
                    div1.appendChild(div2);
                    div1.appendChild(div3);
                    // Add notification to individual green tab
                    var red_div = document.getElementById("1");
                    red_div.insertBefore(div1, red_div.childNodes[0]);
                    // Add notification to default tab
                    //var default_div = document.getElementById("4");
                    //default_div.insertBefore(div1.cloneNode(true), default_div.childNodes[0]);

                }
                // People count algo 
                if(this.message.notification_type == 'People_Count'){
                    // Activate green notification section
                    this.yellow = false;
                    this.red = false;
                    this.green = true;
                    // Activate green border notification section
                    this.yellow_border = false;
                    this.red_border = false;
                    this.green_border = true;
                    // notiifcation count for today
                    this.notificationService.count('People_Count','video')
                        .subscribe(
                            data => {
                                this.green_count = data ;
                            },
                            error => {
                                console.log("error");
                            }
                        )

                    //Append green notification child
                    var div1 = document.createElement('div');
                        div1.className = 'green-notified-message notification-msg';
                        div1.id = this.message.notification_id;
                        div1.setAttribute("scene_id",this.message.scene_id);
                    this.renderer.listen(div1, 'click', (evt) => {
                        console.log('Clicking the button', evt.target.id);
                        this.router.navigate(['/notification/view'],{ queryParams: { 
                            scene_id : document.getElementById(evt.target.id).getAttribute('scene_id') , 
                            notification_id : evt.target.id,
                            media_type : 'video' 
                        } });
                    });    

                    var div2 = document.createElement('div');
                        div2.className = 'info';
                        div2.style.pointerEvents = 'none';
                    var h5 = document.createElement('h5');
                        h5.innerHTML = this.message.cam_name;
                        h5.style.pointerEvents = 'none';
                    // var span = document.createElement('span');
                    //     if((new Date(parseInt(this.message.time_stamp)*1000)).getTime() > 0){
                    //         console.log("inside timestamp");
                    //         var d = new Date(parseInt(this.message.time_stamp)*1000);
                    //         span.innerHTML = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear() +" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
                    //     }else {
                    //         span.innerHTML = this.message.time_stamp;
                    //     }
                    //     span.style.pointerEvents = 'none';
                    var div3 = document.createElement('div');
                        div3.className = 'describtion-text';
                        div3.style.pointerEvents = 'none';
                    var p = document.createElement('p');
                        p.innerHTML = this.message.notification_text;
                        p.style.pointerEvents = 'none';
                   
                    div2.appendChild(h5);
                    // div2.appendChild(span);
                    div3.appendChild(p);
                    div1.appendChild(div2);
                    div1.appendChild(div3);
                    // Add notification to individual green tab
                    var green_div = document.getElementById("3");
                    green_div.insertBefore(div1, green_div.childNodes[0]);
                    // Add notification to default tab
                    //var default_div = document.getElementById("4");
                    //default_div.insertBefore(div1.cloneNode(true), default_div.childNodes[0]);

                }
                // Vehicle Tracking algo
                if(this.message.notification_type == 'Vehicle_Count'){
                    // Activate yellow notification section
                    this.green = false;
                    this.red = false;
                    this.yellow = true;
                     // Activate green border notification section
                     this.green_border = false;
                     this.red_border = false;
                     this.yellow_border = true;
                    // notiifcation count for today
                    this.notificationService.count('Vehicle_Count','video')
                        .subscribe(
                            data => {
                                this.yellow_count = data ;
                            },
                            error => {
                                console.log("error");
                            }
                        )

                    //Append yellow notification child
                    var div1 = document.createElement('div');
                        div1.className = 'yellow-notified-message notification-msg';
                        div1.id = this.message.notification_id;
                        div1.setAttribute("scene_id",this.message.scene_id);
                    this.renderer.listen(div1, 'click', (evt) => {
                        // console.log('Clicking the button', evt.target.id);
                        this.router.navigate(['/notification/view'],{ queryParams: { 
                            scene_id : document.getElementById(evt.target.id).getAttribute('scene_id') , 
                            notification_id : evt.target.id,
                            media_type : 'video' 
                        } });
                    });    

                    var div2 = document.createElement('div');
                        div2.className = 'info';
                        div2.style.pointerEvents = 'none';
                    var h5 = document.createElement('h5');
                        h5.innerHTML = this.message.cam_name;
                        h5.style.pointerEvents = 'none';
                    // var span = document.createElement('span');
                    //     if((new Date(parseInt(this.message.time_stamp)*1000)).getTime() > 0){
                    //         var d = new Date(parseInt(this.message.time_stamp)*1000);
                    //         span.innerHTML = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear() +" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
                    //     }else {
                    //         span.innerHTML = this.message.time_stamp;
                    //     }
                    //     span.style.pointerEvents = 'none';
                    var div3 = document.createElement('div');
                        div3.className = 'describtion-text';
                        div3.style.pointerEvents = 'none';
                    var p = document.createElement('p');
                        p.innerHTML = this.message.notification_text;
                        p.style.pointerEvents = 'none';
                   
                    div2.appendChild(h5);
                    // div2.appendChild(span);
                    div3.appendChild(p);
                    div1.appendChild(div2);
                    div1.appendChild(div3);

                    // Add notification to individual yellow tab
                    var yellow_div = document.getElementById("2");
                    yellow_div.insertBefore(div1, yellow_div.childNodes[0]);

                    // Add notification to defaullt tab
                    //var default_div = document.getElementById("4");
                    //default_div.insertBefore(div1.cloneNode(true), default_div.childNodes[0]);
                }
            });
    }

    getSocketMessage(){
        this.getMessage()
            .subscribe(message => {
                this.message = message;
                console.log(this.message.cam_id);
                if(typeof this.message.cam_id != 'undefined' && typeof this.message.frame_src != 'undefined'){
                    if(typeof this.message.frame_src != 'undefined' && this.message.frame_src != null)
                        document.getElementById('frame_'+this.message.cam_id).setAttribute("src",this.message.frame_src);
                    else
                        document.getElementById('frame_'+this.message.cam_id).setAttribute("src","https://s3.amazonaws.com/2g3c-codes/no-feed.jpg");
                    // if(this.isBig == true && this.message.cam_id == this.full_screen_cam_id)
                    // this.full_screen_view = this.message.frame_src;
                }
                // INTRUSION count algo 
                if(this.message.notification_type == 'INTRUSION'){
                    // Activate red notification section
                    this.yellow = false;
                    this.red = true;
                    this.green = false;
                    // Activate red border notification section
                    this.yellow_border = false;
                    this.red_border = true;
                    this.green_border = false;
                    // notiifcation count for today
                    this.notificationService.count('INTRUSION','video')
                        .subscribe(
                            data => {
                                this.red_count = data ;
                            },
                            error => {
                                console.log("error");
                            }
                        )

                    //Append green notification child
                    var div1 = document.createElement('div');
                        div1.className = 'red-notified-message notification-msg';
                        div1.id = this.message.notification_id;
                        div1.setAttribute("scene_id",this.message.scene_id);
                    this.renderer.listen(div1, 'click', (evt) => {
                        console.log('Clicking the button', evt.target.id);
                        this.router.navigate(['/notification/view'],{ queryParams: { 
                            scene_id : document.getElementById(evt.target.id).getAttribute('scene_id') , 
                            notification_id : evt.target.id, 
                            media_type : 'video' 
                        } });
                    });    

                    var div2 = document.createElement('div');
                        div2.className = 'info';
                        div2.style.pointerEvents = 'none';
                    var h5 = document.createElement('h5');
                        h5.innerHTML = this.message.cam_name;
                        h5.style.pointerEvents = 'none';
                   
                    var div3 = document.createElement('div');
                        div3.className = 'describtion-text';
                        div3.style.pointerEvents = 'none';
                    var p = document.createElement('p');
                        p.innerHTML = this.message.notification_text;
                        p.style.pointerEvents = 'none';
                   
                    div2.appendChild(h5);
                    // div2.appendChild(span);
                    div3.appendChild(p);
                    div1.appendChild(div2);
                    div1.appendChild(div3);
                    // Add notification to individual green tab
                    var red_div = document.getElementById("1");
                    red_div.insertBefore(div1, red_div.childNodes[0]);
                    // Add notification to default tab
                    //var default_div = document.getElementById("4");
                    //default_div.insertBefore(div1.cloneNode(true), default_div.childNodes[0]);

                }
                // People count algo 
                if(this.message.notification_type == 'People_Count'){
                    // Activate green notification section
                    this.yellow = false;
                    this.red = false;
                    this.green = true;
                    // Activate green border notification section
                    this.yellow_border = false;
                    this.red_border = false;
                    this.green_border = true;
                    // notiifcation count for today
                    this.notificationService.count('People_Count','video')
                        .subscribe(
                            data => {
                                this.green_count = data ;
                            },
                            error => {
                                console.log("error");
                            }
                        )

                    //Append green notification child
                    var div1 = document.createElement('div');
                        div1.className = 'green-notified-message notification-msg';
                        div1.id = this.message.notification_id;
                        div1.setAttribute("scene_id",this.message.scene_id);
                    this.renderer.listen(div1, 'click', (evt) => {
                        console.log('Clicking the button', evt.target.id);
                        this.router.navigate(['/notification/view'],{ queryParams: { 
                            scene_id : document.getElementById(evt.target.id).getAttribute('scene_id') , 
                            notification_id : evt.target.id,
                            media_type : 'video' 
                        } });
                    });    

                    var div2 = document.createElement('div');
                        div2.className = 'info';
                        div2.style.pointerEvents = 'none';
                    var h5 = document.createElement('h5');
                        h5.innerHTML = this.message.cam_name;
                        h5.style.pointerEvents = 'none';
                    // var span = document.createElement('span');
                    //     if((new Date(parseInt(this.message.time_stamp)*1000)).getTime() > 0){
                    //         console.log("inside timestamp");
                    //         var d = new Date(parseInt(this.message.time_stamp)*1000);
                    //         span.innerHTML = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear() +" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
                    //     }else {
                    //         span.innerHTML = this.message.time_stamp;
                    //     }
                    //     span.style.pointerEvents = 'none';
                    var div3 = document.createElement('div');
                        div3.className = 'describtion-text';
                        div3.style.pointerEvents = 'none';
                    var p = document.createElement('p');
                        p.innerHTML = this.message.notification_text;
                        p.style.pointerEvents = 'none';
                   
                    div2.appendChild(h5);
                    // div2.appendChild(span);
                    div3.appendChild(p);
                    div1.appendChild(div2);
                    div1.appendChild(div3);
                    // Add notification to individual green tab
                    var green_div = document.getElementById("3");
                    green_div.insertBefore(div1, green_div.childNodes[0]);
                    // Add notification to default tab
                    //var default_div = document.getElementById("4");
                    //default_div.insertBefore(div1.cloneNode(true), default_div.childNodes[0]);

                }
                // Vehicle Tracking algo
                if(this.message.notification_type == 'Vehicle_Count'){
                    // Activate yellow notification section
                    this.green = false;
                    this.red = false;
                    this.yellow = true;
                     // Activate green border notification section
                     this.green_border = false;
                     this.red_border = false;
                     this.yellow_border = true;
                    // notiifcation count for today
                    this.notificationService.count('Vehicle_Count','video')
                        .subscribe(
                            data => {
                                this.yellow_count = data ;
                            },
                            error => {
                                console.log("error");
                            }
                        )

                    //Append yellow notification child
                    var div1 = document.createElement('div');
                        div1.className = 'yellow-notified-message notification-msg';
                        div1.id = this.message.notification_id;
                        div1.setAttribute("scene_id",this.message.scene_id);
                    this.renderer.listen(div1, 'click', (evt) => {
                        // console.log('Clicking the button', evt.target.id);
                        this.router.navigate(['/notification/view'],{ queryParams: { 
                            scene_id : document.getElementById(evt.target.id).getAttribute('scene_id') , 
                            notification_id : evt.target.id,
                            media_type : 'video' 
                        } });
                    });    

                    var div2 = document.createElement('div');
                        div2.className = 'info';
                        div2.style.pointerEvents = 'none';
                    var h5 = document.createElement('h5');
                        h5.innerHTML = this.message.cam_name;
                        h5.style.pointerEvents = 'none';
                    // var span = document.createElement('span');
                    //     if((new Date(parseInt(this.message.time_stamp)*1000)).getTime() > 0){
                    //         var d = new Date(parseInt(this.message.time_stamp)*1000);
                    //         span.innerHTML = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear() +" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
                    //     }else {
                    //         span.innerHTML = this.message.time_stamp;
                    //     }
                    //     span.style.pointerEvents = 'none';
                    var div3 = document.createElement('div');
                        div3.className = 'describtion-text';
                        div3.style.pointerEvents = 'none';
                    var p = document.createElement('p');
                        p.innerHTML = this.message.notification_text;
                        p.style.pointerEvents = 'none';
                   
                    div2.appendChild(h5);
                    // div2.appendChild(span);
                    div3.appendChild(p);
                    div1.appendChild(div2);
                    div1.appendChild(div3);

                    // Add notification to individual yellow tab
                    var yellow_div = document.getElementById("2");
                    yellow_div.insertBefore(div1, yellow_div.childNodes[0]);

                    // Add notification to defaullt tab
                    //var default_div = document.getElementById("4");
                    //default_div.insertBefore(div1.cloneNode(true), default_div.childNodes[0]);
                }
            });
    }
    /**
     * Search api
     */
    search() {
        if (this.keyword) 
        this.router.navigate(['/search'],{ queryParams: { keyword : this.keyword, pageno : 1, media_type: this.media_type } });
    }
}
