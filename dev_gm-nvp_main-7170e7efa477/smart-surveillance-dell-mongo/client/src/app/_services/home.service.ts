import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { appConfig } from '../app.config';
import { StartCamera } from '../_models/index';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class HomeService {
    constructor(private http: Http) { }

    listCams(): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(appConfig.apiUrl + '/camera/'+localStorage.getItem('user_id'), options)
            .map((response: Response) =>response.json())
            .catch(this.handleErrorObservable);
    }

    start(startCamera: StartCamera): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(appConfig.apiUrl + '/start/camera', JSON.stringify(startCamera),options)
            .map((response: Response) =>response.json())
            .catch(this.handleErrorObservable);
    }
    

    private handleErrorObservable (error: Response | any) {
        console.error(error.message || error);
        return Observable.throw(error.message || error);
    }
    
}