import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { appConfig } from '../app.config';
import { StartCamera } from '../_models/index';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class HomeService {
    constructor(private http: HttpClient) { }

    listCams() {
        // let headers = new Headers({ 'Content-Type': 'application/json' });
        // let options = new RequestOptions({ headers: headers });
        // return this.http.get(appConfig.apiUrl + '/camera?user_id='+localStorage.getItem('user_id'), options)
        //     .map((response: Response) =>response.json())
        //     .catch(this.handleErrorObservable);
        return this.http.get(appConfig.apiUrl + '/camera?user_id='+localStorage.getItem('user_id'), httpOptions);
    }

    start(startCamera: StartCamera) {
        // let headers = new Headers({ 'Content-Type': 'application/json' });
        // let options = new RequestOptions({ headers: headers });
        // return this.http.post(appConfig.apiUrl + '/start/camera', JSON.stringify(startCamera),options)
        //     .map((response: Response) =>response.json())
        //     .catch(this.handleErrorObservable);

        return this.http.post(appConfig.apiUrl + '/start/camera', JSON.stringify(startCamera),httpOptions);
    }
    

    // private handleErrorObservable (error: Response | any) {
    //     console.error(error.message || error);
    //     return Observable.throw(error.message || error);
    // }
    
}