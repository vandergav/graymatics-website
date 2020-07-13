import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Camera } from '../_models/index';
import { appConfig } from '../app.config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class CameraService {
    constructor(private http: Http) { }
    
    add(camera: Camera): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(appConfig.apiUrl + '/camera', 
                JSON.stringify(camera), options)
                .map((response: Response) => response.json())
                .catch(this.handleErrorObservable);
    }

    start_frame(camera: Camera): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(appConfig.apiUrl + '/start/frame', 
                JSON.stringify(camera), options)
                .map((response: Response) => response.json())
                .catch(this.handleErrorObservable);
    }

    start_roi(startCamera: Camera): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put(appConfig.apiUrl + '/start/camera', JSON.stringify(startCamera),options)
            .map((response: Response) =>response.json())
            .catch(this.handleErrorObservable);
    }

    update(camera: Camera): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put(appConfig.apiUrl + '/camera', 
                JSON.stringify(camera), options)
                .map((response: Response) => response.json())
                .catch(this.handleErrorObservable);
    }

    get(camera_id: string): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(appConfig.apiUrl + '/camera/get/'+camera_id, 
                 options)
                .map((response: Response) => response.json())
                .catch(this.handleErrorObservable);
    }

    remove(camera_id: string): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.delete(appConfig.apiUrl + '/camera/'+camera_id, 
                 options)
                .map((response: Response) => response.json())
                .catch(this.handleErrorObservable);
    }

    reset(camera_id: string): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(appConfig.apiUrl + '/reset/camera/'+camera_id, 
                 options)
                .map((response: Response) => response.json())
                .catch(this.handleErrorObservable);
    }
    
    private handleErrorObservable (error: Response | any) {
        //console.error(error.message || error);
        return Observable.throw(error.message || error);
    }

}