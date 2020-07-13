import { Component, OnInit, ViewContainerRef, ViewEncapsulation , ElementRef , Renderer2} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService , NotificationService , CameraService, HomeService } from '../_services/index';
import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'angular2-modal';
import { Modal, BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { Socket } from 'ng-socket-io';
import { Notification } from '../_models/index';
import { User } from '../_models/index';

@Component({
    moduleId: module.id.toString(),
    selector: 'modal',
    templateUrl: 'search.component.html',
    providers: [Modal]
})

export class SearchComponent implements OnInit {
    public notification: Notification;
    model: any = {};
    currentUser: string;
    recentNotification: string;
    scene: any[] = [];
    response: any = {};
    response1: any = {};
    response2: any = {};
    response3: any = {};
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
    latest_notification: any[] = [];
    loading = false;
    message: any = {};
    returnUrl: string;
    notification_id :string;
    isParaActive:boolean = false;
    isBtnActive:boolean = false;
    keyword:string;
    media_type:string;
    total_count: string;
    filter_total_count: string;
    cams : any[] = [];
    camera_name:string;
    camera_time:string;
    
    constructor(
        private elRef:ElementRef,
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService,
        private notificationService : NotificationService,
        public modal: Modal,
        private renderer: Renderer2,
        private cameraService : CameraService,
        private homeService : HomeService,
        private socket: Socket) { 
            this.currentUser = localStorage.getItem('currentUser');
        }

    ngOnInit() {
        this.notification = {
            _id:'',
            status:'',
        }
        // get query params from router
        // this.route
        // .queryParams
        // .subscribe(params => {
        //     // Defaults to 0 if no query param provided.
        //     this.view(params['scene_id'],params['notification_id']);
        // });

        this.route
        .queryParams
        .subscribe(params => {
            // Defaults to 0 if no query param provided.
            this.keyword = params['keyword'];
            this.media_type = params['media_type'];
            this.search(params['keyword'],params['pageno']);
        });
        //call socket message
        // this.getSocketMessage();
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        
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

    // search 
    search(keyword:string,pageno:string) {
        // camera list
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
            }
        );     
        // search keywords count
        keyword = this.keyword;
        this.notificationService.search_total_count(keyword,pageno,this.media_type)
        .subscribe(
            data => {
                // this.scene = data ;
                this.response2 = data;
                this.total_count = this.response2.count;
            },
            error => {
                console.log("error");
            }
        )
        // search api
        keyword = this.keyword;
        this.notificationService.search(keyword,pageno,this.media_type)
        .subscribe(
            data => {
                // this.scene = data ;
                this.response = "";
                this.scene = [];
                this.response = data;
                this.scene = this.response.result;
            },
            error => {
                console.log("error");
            }
        )
    }

    selected_value(type:string,value:string){ 
        if(type == 'name') this.camera_name = value; else if ( typeof this.camera_name === 'undefined') this.camera_name = 'NO CAMERA';
        if(type == 'time') this.camera_time = value; else if ( typeof this.camera_time === 'undefined') this.camera_time = 'ANY TIME';
        if(this.camera_name || this.camera_time) {
            this.notificationService.search_filter_total_count(this.camera_name,this.camera_time,'camera')
            .subscribe(
                data => {
                    // this.scene = data ;
                    this.response3 = data;
                    this.total_count = this.response3.count;
                    this.filter_total_count = "enabled";
                },
                error => {
                    console.log("error");
                }
            )
            // search filter api
            this.notificationService.search_filter(this.camera_name,this.camera_time,"1",'camera')
            .subscribe(
                data => {
                    this.response = "";
                    this.scene = [];
                    this.response = data;
                    this.scene = this.response.result;
                },
                error => {
                    console.log("error");
                }
            )
        } else {
            alert('Please select camera name or time');
        }
    }

    pageChanged(pageno:string) {
        if(this.filter_total_count == 'enabled') {
            // search filter api
            this.notificationService.search_filter(this.camera_name,this.camera_time,pageno,'camera')
            .subscribe(
                data => {
                    this.response = "";
                    this.scene = [];
                    this.response = data;
                    this.scene = this.response.result;
                },
                error => {
                    console.log("error");
                }
            )
        } // search api pagination 
        else {
            this.notificationService.search(this.keyword,pageno,'camera')
            .subscribe(
                data => {
                    console.log("serch pagination...");
                    this.response = "";
                    this.scene = [];
                    this.response = data;
                    this.scene = this.response.result;
                },
                error => {
                    console.log("error");
                }
            )
        }
    }

    veiw_notification(_id:string,scene_id:string) {
        this.router.navigate(['/notification/view'],{ queryParams: { scene_id : scene_id , notification_id : _id } });
    }
    /*
    view(scene_id:string,notification_id:string) {
        // assign notification id to update the nfn status
        this.notification_id = notification_id;
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
        // yellow notiifcation count for today
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
        this.notificationService.get(scene_id)
            .subscribe(
                data => {
                    this.response = data;
                    if(this.response.status == 'error'){
                        this.alertService.error(this.response.message, true);
                        //alert(this.response.message);
                    }
                    else{
                        this.scene = this.response.data;
                        this.recentNotification = this.response.data[this.scene.length-1];
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
                            // var span = document.createElement('span');
                            // var d = new Date(parseInt(this.latest_notification[l].timestamp)*1000);
                            //     span.innerHTML = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear() +" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
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
                           // Adding notification to the red tab
                           document.getElementById("1").appendChild(div1);
                        }
                        // Yellow notications section 
                        if(this.latest_notification[l].type == 'Vehicle_Count') {
                            //Append yellow notification child
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
                            var span = document.createElement('span');
                                span.innerHTML = this.latest_notification[l].timestamp;
                                span.style.pointerEvents = 'none';
                            var div3 = document.createElement('div');
                                div3.className = 'describtion-text';
                                div3.style.pointerEvents = 'none';
                            var p = document.createElement('p');
                                p.innerHTML = this.latest_notification[l].message;
                                p.style.pointerEvents = 'none';
                        
                            div2.appendChild(h5);
                            div2.appendChild(span);
                            div3.appendChild(p);
                            div1.appendChild(div2);
                            div1.appendChild(div3);
                            
                            document.getElementById("2").appendChild(div1);
                        }
                        // Green notificaiton section
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
                            var span = document.createElement('span');
                                span.innerHTML = this.latest_notification[l].timestamp;
                                span.style.pointerEvents = 'none';
                            var div3 = document.createElement('div');
                                div3.className = 'describtion-text';
                                div3.style.pointerEvents = 'none';
                            var p = document.createElement('p');
                                p.innerHTML = this.latest_notification[l].message;
                                p.style.pointerEvents = 'none';
                        
                            div2.appendChild(h5);
                            div2.appendChild(span);
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
                            //console.log('Clicking the button', evt.target.id);
                            this.view(evt.target.id,document.getElementById(evt.target.id).getAttribute('scene_id'));
                            this.router.navigate(['/notification/view'],{ queryParams: { scene_id : document.getElementById(evt.target.id).getAttribute('scene_id') , notification_id : evt.target.id } });
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
    */
 
}
