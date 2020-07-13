import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../_models/index';
import { AlertService, UserService } from '../_services/index';
import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'angular2-modal';
import { Modal, BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'register.component.html',
    providers: [Modal]
})

export class RegisterComponent implements OnInit {
    public user: User;
    model: any = {};
    loading = false;
    response: any = {};

    constructor(
        private router: Router,
        private userService: UserService,
        private alertService: AlertService,
        public modal: Modal) { }
    
      

    ngOnInit() {
        this.user = {
            organization:'',
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    }

    register(model: User, isValid: boolean) {
        console.log("in registrtaion component"+isValid);
        if(!isValid) return;
        this.loading = true;
        this.userService.create(this.user)
            .subscribe(
                data => {
                    //this.alertService.success('Registration successful', true);
                    this.response = data;
                    if(this.response.status == 'error'){
                        //this.alertService.error(this.response.message, true);
                        var msg = JSON.parse(this.response.message.replace(/\\/g, ""));
                        if(msg.username)
                            this.alertService.error(this.response.message, true);
                        else if(msg.user_email)
                            this.alertService.error(this.response.message, true);
                        else
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
                                this.router.navigate(['/login']);
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
}
