import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { User } from '../_models/index';
import { Observable } from 'rxjs/Observable';
import { appConfig } from '../app.config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
@Injectable()
export class UserService {
    constructor(private http: Http) { }
    
    create(user : User): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(appConfig.apiUrl + '/user',
                JSON.stringify({company_name: user.organization, 
                                username: user.username, 
                                user_email: user.email,
                                user_password: user.password}), options)
            .map((response: Response) => response.json())
            .catch(this.handleErrorObservable);
    }

    private handleErrorObservable (error: Response | any) {
        console.error(error.message || error);
        return Observable.throw(error.message || error);
    }

    
}