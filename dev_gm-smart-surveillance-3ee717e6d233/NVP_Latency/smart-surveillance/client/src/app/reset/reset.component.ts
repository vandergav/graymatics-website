import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService, ResetService } from '../_services/index';
import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'angular2-modal';
import { Modal, BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'reset.component.html',
    providers: [Modal]
})

export class ResetComponent implements OnInit {
    model: any = {};
    response: any = {};
    user_id: number;
    code: string;
    loading = false;
    private sub: any;
    returnUrl: string;
    form: FormGroup;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private resetService: ResetService,
        private alertService: AlertService,
        public modal: Modal) {
        }
   
    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            // (+) converts string 'user_id' to a number
            this.model.user_id = +params['user_id']; 
            this.model.code = params['code'];
            // In a real app: dispatch action to load the details here.
        });
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    reset(isValid: boolean) {
        console.log("in reset component"+isValid);
        if(!isValid) return;
        this.loading = true;
        this.resetService.reset(this.model.user_id,this.model.code,this.model.password)
            .subscribe(
                data => {
                    this.response = data;
                    if(this.response.status == 'error'){
                        this.alertService.error(this.response.message, true);
                        //alert(this.response.message);
                    }
                    else{
                        const dialog =   this.modal.alert()
                                        .size('sm')
                                        .body(this.response.message)
                                        .open();
                         dialog                    
                        .catch((err: any) => console.log('ERROR: ' + err))
                        .then((dialog: any) => { return dialog.result })
                        .then((result: any) => { 
                                this.router.navigate(['this.returnUrl']);
                            })
                        .catch((err: any) => { alert("catch") });
                        //alert(this.response.message);
                    }
                },
                error => {
                    //this.alertService.error(error);
                     this.modal.alert()
                    .size('sm')
                    .body("Server Error")
                    .open();
                    this.loading = false;
                });
    }
}
