import { Component, OnInit, ViewContainerRef, ViewEncapsulation , ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, ForgotService } from '../_services/index';
import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'angular2-modal';
import { Modal, BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
@Component({
    moduleId: module.id.toString(),
    templateUrl: 'forgot.component.html',
    providers: [Modal]
})

export class ForgotComponent implements OnInit {
    model: any = {};
    response: any = {};
    loading = false;
    returnUrl: string;

    
    constructor(
        private elRef:ElementRef,
        private route: ActivatedRoute,
        private router: Router,
        private forgotService: ForgotService,
        private alertService: AlertService,
        public modal: Modal) { }

    ngOnInit() {
        
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    forgot(isValid:boolean) {
        console.log("forgot vaidation is "+isValid);
        if(!isValid) return;
        this.loading = true;
        this.forgotService.forgot(this.model.email)
            .subscribe(
                data => {
                    this.response = data;
                    if(this.response.status == 'error'){
                        this.alertService.error(this.response.message, true);
                    }
                    else{
                        //this.alertService.success(this.response.message);
                        const dialog =   this.modal.alert()
                                        .size('sm')
                                        .body(this.response.message)
                                        .open();
                         dialog                    
                        .catch((err: any) => console.log('ERROR: ' + err))
                        .then((dialog: any) => { return dialog.result })
                        .then((result: any) => { 
                                this.router.navigate([this.returnUrl]);
                            })
                        .catch((err: any) => { alert("catch") });
                        //this.router.navigate([this.returnUrl]);
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
}
