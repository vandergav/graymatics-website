import { Component, OnInit, ViewContainerRef, ViewEncapsulation , ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../../_services/index';
import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'angular2-modal';
import { Modal, BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'agent-view.component.html',
    providers: [Modal]
})

export class AgentViewComponent implements OnInit {
    model: any = {};
    response: any = {};
    currentUser: string;
    loading = false;
    returnUrl: string;

    
    constructor(
        private elRef:ElementRef,
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService,
        public modal: Modal) {
            this.currentUser = localStorage.getItem('currentUser');
        }

    ngOnInit() {
        
    }

    main() {
        
    }
}
