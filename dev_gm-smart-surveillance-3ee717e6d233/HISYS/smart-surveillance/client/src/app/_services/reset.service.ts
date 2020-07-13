import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { appConfig } from '../app.config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ResetService {
    constructor(private http: Http) { }

    reset(user_id: string, code: string, password: string): Observable<string> {
        console.log(password , user_id , code);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(appConfig.apiUrl +'/user/reset', JSON.stringify({ user_id: user_id, code: code, user_password: password}), options)
            .map((response: Response) =>response.json())
            .catch(this.handleErrorObservable);;
    }

    private handleErrorObservable (error: Response | any) {
        console.error(error.message || error);
        return Observable.throw(error.message || error);
    }
    
}