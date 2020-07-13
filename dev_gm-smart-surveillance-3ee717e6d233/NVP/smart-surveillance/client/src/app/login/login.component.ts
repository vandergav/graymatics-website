import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HomeComponent } from '../home/index';
import { AlertService, AuthenticationService } from '../_services/index';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'login.component.html',
    providers: [HomeComponent]
    
})

export class LoginComponent implements OnInit {
    model: any = {};
    response: any = {};
    loading = false;
    returnUrl: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private homeComponent: HomeComponent,
        private alertService: AlertService) { }

    ngOnInit() {
        // reset login status
        this.authenticationService.logout();

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    login() {
        this.loading = true;
        this.authenticationService.login(this.model)
            .subscribe(
                data => {
                    this.response = data;
                    if(this.response.status == 'error'){
                        this.alertService.error(this.response.message, true);
                        //alert(this.response.message);
                    }
                    else{
                        // store user details and jwt token in local storage to keep user logged in between page refreshes
                        let keyUser = 'currentUser',keyId = 'user_id';
                        localStorage.setItem(keyUser, this.response.user.username);
                        localStorage.setItem(keyId, this.response.user._id);
                        //this.alertService.success(this.response.message);
                        //alert(this.response.message);
                        //this.router.navigate(['/home']);
                        //this.homeComponent.home();
                    }
                    // navigate to superver home
                    if(this.response.status != 'error' && this.response.user.username == 'superviser')
                        this.router.navigate(['/supervisor/dashboard/agent-view'])
                    else
                        this.router.navigate([this.returnUrl]);
                },
                error => {
                    alert("Server Error!");
                    //console.log("data::"+JSON.stringify(error));
                    //this.alertService.error("server error");
                    this.loading = false;
                });
    }
}
