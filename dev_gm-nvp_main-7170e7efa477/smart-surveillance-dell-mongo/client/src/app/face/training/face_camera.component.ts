import { Component,Pipe, OnInit, ViewContainerRef, ViewEncapsulation , ElementRef , Renderer2, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, 
         NotificationService,
         CameraService } from '../../_services/index';
import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'angular2-modal';
let RecordRTC = require('recordrtc/RecordRTC.min');
import { appConfig } from '../../app.config';
const URL = appConfig.apiUrl+'/upload';

@Component({
    selector: 'record-rtc',
    templateUrl: 'face_camera.component.html'
})

export class FaceCameraComponent implements AfterViewInit {

    private stream: MediaStream;
    private recordRTC: any;
  
    @ViewChild('video') video : ElementRef;
    @ViewChild('myBar') myBar : ElementRef;
    @ViewChild('add-subject-ftp-upload-popup') closeBtn : ElementRef;
    
    model: any = {};
    response: any = {};
    response4: any = {};
    currentUser: string;
    loading = false;

    
    constructor(
        private elRef:ElementRef,
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService,
        private renderer: Renderer2) {
            this.currentUser = localStorage.getItem('currentUser');
        }
    
    ngAfterViewInit() {
        // set the initial state of the video
        let video:HTMLVideoElement = this.video.nativeElement;
        video.muted = false;
        video.controls = false;
        video.autoplay = true;
        // this.setRecordingDuration();
    }

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

        // auto stop recording after 15 seconds
        this.setRecordingDuration();
        // this.recordRTC.setRecordingDuration(15 * 1000).onRecordingStopped(function(url:any) {
        //     console.debug('setRecordingDuration', url);
        //     // window.open(url);
        // })

        this.recordRTC.startRecording();
        this.progressBar();
        let video: HTMLVideoElement = this.video.nativeElement;
        video.src = window.URL.createObjectURL(stream);
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
        // upload recording
        setTimeout(() => {
            this.upload();
        }, 500);
    }

    upload() {
        // this.recordRTC.save('video.mp4');
        var xhr = new XMLHttpRequest();
        var blob = this.recordRTC.getBlob();
        var file = new File([blob], 'gm_face_', {
            type: 'video/webm'
        });
        // submit file to api
        var formData = new FormData();
        formData.append('file', file); // upload "File" object rather than a "Blob"

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    console.log(xhr.response);
                    alert("successfully uploaded");
                } else {

                }
            }
        }
        xhr.open("POST", URL, true);
        xhr.send(formData);
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
        let elem: HTMLVideoElement = this.myBar.nativeElement;
        var width = 1;
        var id = setInterval(frame, 600);
        function frame() {
          if (width >= 100) {
              clearInterval(id);
              // close modal popup
              this.closeBtn.nativeElement.click();
          } else {
            width++; 
            elem.style.width = width + '%'; 
          }
        }
      }
}
