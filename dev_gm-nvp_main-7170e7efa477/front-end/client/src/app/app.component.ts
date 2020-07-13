import { Component } from '@angular/core';

import '../assets/css/bootstrap.css';
import '../assets/style.css';
import '../assets/css/font-awesome.min.css';
import '../assets/css/default.css';
import '../assets/css/component.css';

import '../assets/css/admin.css';
import '../assets/css/supervisor.css';

import '../assets/js/main.js';


@Component({
    moduleId: module.id.toString(),
    selector: 'app',
    templateUrl: 'app.component.html'
})

export class AppComponent { 
    constructor(){}
    
    ngOnInit(){
    }
}