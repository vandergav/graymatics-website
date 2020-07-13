import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Notification } from '../_models/index';
import { appConfig } from '../app.config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ReportsService {
    constructor(private http: Http) { }

    get(scene_id:String): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(appConfig.apiUrl + '/notification/'+scene_id, options)
            .map((response: Response) =>response.json())
            .catch(this.handleErrorObservable);
    }

    getCamNotifications(camera_id:number): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(appConfig.apiUrl + '/camera/notifications/'+localStorage.getItem('user_id')+'/'+camera_id, options)
            .map((response: Response) =>response.json())
            .catch(this.handleErrorObservable);
    }

    update(notification: Notification): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put(appConfig.apiUrl + '/notification', 
                JSON.stringify(notification), options)
                .map((response: Response) => response.json())
                .catch(this.handleErrorObservable);
    }
    
    update_basic(notification: Notification): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put(appConfig.apiUrl + '/basic_notification', 
                JSON.stringify(notification), options)
                .map((response: Response) => response.json())
                .catch(this.handleErrorObservable);
    }

    latest(): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(appConfig.apiUrl + '/notification/latest', options)
            .map((response: Response) =>response.json())
            .catch(this.handleErrorObservable);
    }

    count(type:string): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(appConfig.apiUrl + '/basic_notification/count/'+localStorage.getItem('user_id')+'/'+type, options)
            .map((response: Response) =>response.json())
            .catch(this.handleErrorObservable);
    }

    action_count(type:string): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(appConfig.apiUrl + '/basic_notification/action/count/'+localStorage.getItem('user_id')+'/'+type, options)
            .map((response: Response) =>response.json())
            .catch(this.handleErrorObservable);
    }

    remove(camera_id: number): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.delete(appConfig.apiUrl + '/camera/notifications/'+camera_id, 
                 options)
                .map((response: Response) => response.json())
                .catch(this.handleErrorObservable);
    }

    private handleErrorObservable (error: Response | any) {
        console.error(error.message || error);
        return Observable.throw(error.message || error);
    }
    
}