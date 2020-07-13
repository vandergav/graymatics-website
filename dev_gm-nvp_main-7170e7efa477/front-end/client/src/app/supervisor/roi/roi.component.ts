import { Component, OnInit} from "@angular/core";
import { Router, ActivatedRoute, Params} from "@angular/router";
import { drawCanvas, removeCanvas, clearCanvasX} from './label';
import { AlertService } from '../../_services/index';
import { CameraService } from '../../_services/index';
import { Camera } from '../../_models/index';
import { Observable } from "rxjs";
import { Curve } from "./curve";
import { Modal, BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';


@Component({
  moduleId: module.id.toString(),
  templateUrl: 'roi.component.html',
  providers: [Modal]
})
export class ROIComponent implements OnInit {
  public camera: Camera;
  imageId: number;
  currentUser: string;
  imageIds: number[];
  prev: number;
  next: number;
  editingMode: boolean = false;
  curve: Curve;
  response: any;
  response1: any;
  loading: any;

  constructor(
              private route: ActivatedRoute,
              private alertService: AlertService,
              private cameraService: CameraService,
              private router: Router,
              public modal: Modal
            ) {
            this.currentUser = localStorage.getItem('currentUser');
  }

  ngOnInit() {
    this.camera = {
      camera_id:'',
      peopleCount: false,
      vehicleCount: false,
      vehicleSpeed: false,
      vehicleTracking: false,
      peopleTracking: false,
      faceRecognition: false,
      intrusionDetection: false,
      peopleList: false,
      vehicleList: false,
      faceAnalytics : false,
      deepAssurance : false,
      carCrashDetection : false,
      wrongTurnDetection : false,
      parkingViolation : false,
      crowdDetection : false,
      fashion : false,
      litterDetection : false,
      helmetDetection : false,
      climbingDetection : false,
      theme : false,
      anpr : false,
      violence : false,
      user_id : '',
      name:'',
      type:'',
      source: '',
      roi: [''],
      frame: '',
      fps:'',
      gps: '',
      status:'',
      protocol: '',
      interface: '',
      agent:'',
      media_type: '',
      algo : ['']
  }
    // get query params from add camera 
    this.route
    .queryParams
    .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.camera.camera_id = params['camera_id'];
        this.camera.name = params['name'];
        this.camera.user_id = params['user_id'];
        this.camera.source = params['source'];
        this.camera.frame = params['frame'];
        // this.camera.protocol = params['protocol'];
        // this.camera.interface = params['interface'];
        // this.camera.algo = params['algos'];
    });
  }

  public activateEditingMode() {
    this.editingMode = true;
    this.curve = drawCanvas();
  }

  public deactivateEditingMode() {
    this.editingMode = false;
    removeCanvas();
  }

  public clearCanvas(){
    // TODO: This should just clear the canvas
    removeCanvas();
    drawCanvas();
  }

  public submitAnnotation(){
    console.log(this.curve._path['undefined']);
    console.log(this.camera);
    this.camera.roi = this.curve._path['undefined'];
    // this.camera.roi.push(this.curve._path['undefined']);
    this.cameraService.update(this.camera)
    .subscribe(
        data => {
            //this.alertService.success('Registration successful', true);
            this.response = data;
            if(this.response.status == 'error'){
                  this.alertService.error(this.response.message, true);
            }
            else{
                // console.log(this.response);
                const dialog =   this.modal.alert()
                                .size('sm')
                                .body(this.response.message)
                                .open();
                 dialog                    
                .catch((err: any) => console.log('ERROR: ' + err))
                .then((dialog: any) => { return dialog.result })
                .then((result: any) => { 
                    this.cameraService.start_roi(this.camera)
                      .subscribe(
                        data => {
                          this.response1 = data;
                          console.log(this.response1);
                          if(this.response.status == 'error'){
                            this.alertService.error(this.response.message, true);
                          } else {
                            this.router.navigate(['/']);
                          }
                        })
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
    // deactivate roi window
    this.deactivateEditingMode();
  }

  private setPrevNext() {
    let index = this.imageIds.indexOf(this.imageId);
    this.prev = this.imageIds[this.mod((index - 1), this.imageIds.length)];
    this.next = this.imageIds[this.mod((index + 1), this.imageIds.length)];
  }

  mod(n: number, m: number): number {
    return ((n % m) + m) % m;
  }
}
