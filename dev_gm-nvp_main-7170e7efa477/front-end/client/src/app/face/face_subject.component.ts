import { Component,Pipe, OnInit, ViewContainerRef, ViewEncapsulation , ElementRef , Renderer2 , ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {AlertService, 
        NotificationService,
        CameraService,
        FaceService } from '../_services/index';
import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'angular2-modal';
import { Modal, BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { Socket } from 'ng-socket-io';
import { Face } from '../_models/index';
import { FileUploader } from 'ng2-file-upload';
let RecordRTC = require('recordrtc/RecordRTC.min');
import { appConfig } from '../app.config';
const URL = appConfig.apiUrl+'/upload';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'face_subject.component.html',
    providers: [Modal]
})

export class FaceSubjectComponent implements AfterViewInit {
    public face : Face;
    model: any = {};
    response: any = {};
    response1: any = {};
    response4: any = {};
    camDetails: any = {};
    currentUser: string;
    notification_list: any[] = [];
    cmaera_id :number;
    loading = false;
    subject_val : string;
    gender_val : string;

    private stream: MediaStream;
    private recordRTC: any;
  
    @ViewChild('video') video : ElementRef;
    @ViewChild('myBar') myBar : ElementRef;
    @ViewChild('modal') modal_id : ElementRef;


    public uploader:FileUploader = new FileUploader({url: URL});
    public hasBaseDropZoneOver:boolean = false;
    public hasAnotherDropZoneOver:boolean = false;
    
    constructor(
        private elRef:ElementRef,
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService,
        private renderer: Renderer2,
        private notificationService: NotificationService,
        private cameraService: CameraService,
        private faceService: FaceService,
        private socket: Socket,
        public modal: Modal) {
            this.currentUser = localStorage.getItem('currentUser');
        }

    ngOnInit() {
        // init the face model
        this.face = {
            user_id         : localStorage.getItem('user_id'),
            face_id         : '',
            subject_type    : '',
            name            : '',
            age             : '',
            gender          : '',
            status          : 'pending',
            frame           : '',
            ethnicity       : '',
            source          : '',
        }

         // get query params from face to edit the face subject 
         this.route
         .queryParams
         .subscribe(params => {
             // Defaults to 0 if no query param provided.
             this.face.face_id = params['face_id'];
             this.subject_val = params['subject_type'];
             this.face.name = params['name'];
             this.face.age = params['age'];
             this.gender_val = params['gender'];
             this.face.ethnicity = params['ethnicity'];
         });
        // init the face drop downs
        if(typeof this.subject_val == 'undefined' )this.subject_val = 'Blacklist';
        if(typeof this.gender_val  == 'undefined' )this.gender_val = 'Male';
    }

    ngAfterViewInit() {
        // set the initial state of the video
        let video:HTMLVideoElement = this.video.nativeElement;
        video.muted = false;
        video.controls = false;
        video.autoplay = true;
        // this.setRecordingDuration();
    }


    public fileOverBase(e:any):void {
        this.hasBaseDropZoneOver = e;
    }
     
    public fileOverAnother(e:any):void {
        this.hasAnotherDropZoneOver = e;
    }
    
    // web cam functionality
    toggleControls() {
        let video: HTMLVideoElement = this.video.nativeElement;
        video.muted = !video.muted;
        video.controls = !video.controls;
        video.autoplay = !video.autoplay;
    }

    successCallback(stream: MediaStream) {
        var options = {
            mimeType: 'video/webm', // or video/webm\;codecs=h264 or video/webm\;codecs=vp9
            audioBitsPerSecond: 128000,
            videoBitsPerSecond: 128000,
            bitsPerSecond: 128000 // if this line is provided, skip above two
        };
        
        this.stream = stream;
        this.recordRTC = RecordRTC(stream, options);
        // call start recording funcaiton
        this.recordRTC.startRecording();
        // to show the progress bar
        this.progressBar();

        let video: HTMLVideoElement = this.video.nativeElement;
        video.src = window.URL.createObjectURL(stream);
        // stop recoring call
        setTimeout(() => {
            this.stopRecording();
        }, 60000);

        // this.toggleControls();
    }

    errorCallback() {
    //handle error here
    }

    processVideo(audioVideoWebMURL:any) {
        let video: HTMLVideoElement = this.video.nativeElement;
        let recordRTC = this.recordRTC;
        video.src = audioVideoWebMURL;
        this.toggleControls();
        var recordedBlob = recordRTC.getBlob();
        recordRTC.getDataURL(function (dataURL:string) { });
    }

    startRecording() {
        let mediaConstraints = {
            video: {
            mandatory: {
                minWidth: 1280,
                minHeight: 720
            }
            }, audio: true
        };
        navigator.mediaDevices
            .getUserMedia(mediaConstraints)
            .then(this.successCallback.bind(this), this.errorCallback.bind(this));
        // stop the recording after 60 seconds
        // setTimeout(() => {
        //     this.stopRecording();
        // }, 60000);
    }

    stopRecording() {
        let recordRTC = this.recordRTC;
        recordRTC.stopRecording(this.processVideo.bind(this));
        let stream = this.stream;
        stream.getAudioTracks().forEach(track => track.stop());
        stream.getVideoTracks().forEach(track => track.stop());
        this.toggleControls();
        // upload recording
        setTimeout(() => {
            this.upload();
        }, 500);
    }
                                                                                                                                                                                                                                                                                                                                                                                    
    upload() {
        // this.recordRTC.save('video.mp4');
        var xhr = new XMLHttpRequest();
        var blob = this.recordRTC.getBlob();
        var file = new File([blob], 'gm_face', {
            type: 'video/webm'
        });
        // submit file to api
        var formData = new FormData();
        formData.append('file', file); // upload "File" object rather than a "Blob"
        // formData.append('user_id',localStorage.getItem('user_id'));
        // Upload web recorded video to the minio
        this.faceService.file_upload(formData)
        .subscribe(
            data => {
                this.response = data;
                if(this.response.status == 'error'){
                    this.alertService.error(this.response.message, true);
                }
                else if(typeof this.face.face_id == 'undefined'){
                    this.face.subject_type = (<HTMLElement>document.getElementById("subject_type")).textContent;
                    this.face.gender = (<HTMLElement>document.getElementById("gender")).textContent;
                    // this.face.age = (<HTMLInputElement>document.getElementById("age")).value;
                    // this.face.subject_type = (<HTMLElement>document.getElementById("subject_type")).textContent;
                    // this.face.name = (<HTMLInputElement>document.getElementById("name")).value;
                    // this.face.gender = (<HTMLElement>document.getElementById("gender")).textContent;
                    // this.face.ethnicity = (<HTMLInputElement>document.getElementById("ethnicity")).value;
                    this.face.source = this.response.source;
                    // create face subject record
                    this.faceService.add(this.face)
                    .subscribe(
                        data => {
                            this.response1 = data;
                            if(this.response1.status == 'error'){
                                this.alertService.error(this.response1.message, true);
                            }
                            else{
                                if(this.response1.status == 'success') {
                                    this.face.face_id = this.response1.result._id;
                                    this.faceService.face_tarining(this.face)
                                    .subscribe(
                                        data => {
                                            this.response4 = data;
                                            if(this.response4.status == 'error'){
                                                this.alertService.error(this.response4.message, true);
                                            }
                                            else{
                                                if(this.response4.status == 'success') {
                                                    this.router.navigate(['/face']);
                                                }
                                            }
                                        },
                                        error => {
                                            alert("Server Error!");
                                            this.loading = false;
                                        });
                                }
                            }
                        },
                        error => {
                            alert("Server Error!");
                            this.loading = false;
                        });
                } else if(this.face.face_id) {

                }
            },
            error => {
                alert("Server Error!");
                this.loading = false;
            });
    }

    setRecordingDuration() {
        let video: HTMLVideoElement = this.video.nativeElement;
        // video.controls = true;
        let recordRTC = this.recordRTC;
        var oneMinute = 1 * 1000 * 60;

        recordRTC.setRecordingDuration(oneMinute, function() {
            var blob = this.getBlob();
            video.src = this.toURL();
        });
        
        // or otherwise
        recordRTC.setRecordingDuration(oneMinute).onRecordingStopped(function() {
            var blob = this.getBlob();
            video.src = this.toURL();
        });

        
    }

    progressBar() {
        let elem: HTMLDivElement = this.myBar.nativeElement;
        var width = 1;
        var id = setInterval(frame, 600);
        // var id = setInterval(frame, 120);
        function frame() {
          if (width >= 100) {
            clearInterval(id);
            // close modal popup
            document.getElementById("add-subject-ftp-upload-popup").setAttribute("class","");
            document.getElementById("add-subject-ftp-upload-popup").setAttribute("class","cmn-modal-body popup-style modal fade");
            document.getElementById("add-subject-ftp-upload-popup").style.display = "none";
          } else {
            width++; 
            elem.style.width = width + '%'; 
          }
        }
    }

    live_camera() {
        if( typeof this.face.name == 'undefined' || typeof this.face.age == 'undefined' || typeof this.face.ethnicity == 'undefined') 
        alert("Please fill the face subject details");
        else 
        (<HTMLElement>document.getElementById("webcam_modal")).click();
    }
}
