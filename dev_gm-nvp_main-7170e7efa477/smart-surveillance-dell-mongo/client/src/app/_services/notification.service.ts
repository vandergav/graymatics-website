import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Notification } from '../_models/index';
import { appConfig } from '../app.config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class NotificationService {
    constructor(private http: Http) { }

    get(scene_id:String,media_type:string): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(appConfig.apiUrl + '/notification/'+scene_id+'/'+media_type, options)
            .map((response: Response) =>response.json())
            .catch(this.handleErrorObservable);
    }

    getCamNotifications(camera_id:string,media:string): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(appConfig.apiUrl + '/camera/notifications/'+localStorage.getItem('user_id')+'/'+camera_id+'/'+media, options)
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

    latest(media:string): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(appConfig.apiUrl + '/notification/latest/'+localStorage.getItem('user_id')+'/'+media, options)
            .map((response: Response) =>response.json())
            .catch(this.handleErrorObservable);
    }

    count(type:string,media:string): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(appConfig.apiUrl + '/basic_notification/count/'+localStorage.getItem('user_id')+'/'+type+'/'+media, options)
            .map((response: Response) =>response.json())
            .catch(this.handleErrorObservable);
    }

    action_count(type:string,media:string): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(appConfig.apiUrl + '/basic_notification/action/count/'+localStorage.getItem('user_id')+'/'+type+'/'+media, options)
            .map((response: Response) =>response.json())
            .catch(this.handleErrorObservable);
    }

    summary_report(): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(appConfig.apiUrl + '/reports/summary/'+localStorage.getItem('user_id'), options)
            .map((response: Response) =>response.json())
            .catch(this.handleErrorObservable);
    }

    vehicle_report(): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(appConfig.apiUrl + '/reports/vehicle/'+localStorage.getItem('user_id'), options)
            .map((response: Response) =>response.json())
            .catch(this.handleErrorObservable);
    }

    face_report(): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(appConfig.apiUrl + '/reports/face/'+localStorage.getItem('user_id'), options)
            .map((response: Response) =>response.json())
            .catch(this.handleErrorObservable);
    }

    remove(camera_id: string): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.delete(appConfig.apiUrl + '/camera/notifications/'+camera_id, 
                 options)
                .map((response: Response) => response.json())
                .catch(this.handleErrorObservable);
    }
    
    search(keyword:string,pageno:string,media_type:string): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(appConfig.apiUrl + '/search/'+localStorage.getItem('user_id')+'/'+pageno+'/'+keyword+'/'+media_type, options)
            .map((response: Response) =>response.json())
            .catch(this.handleErrorObservable);
    }

    search_total_count(keyword:string,pageno:string,media_type:string): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(appConfig.apiUrl + '/search_total_count/'+localStorage.getItem('user_id')+'/'+pageno+'/'+keyword+'/'+media_type, options)
            .map((response: Response) =>response.json())
            .catch(this.handleErrorObservable);
    }

    search_filter(camera_name:string,time:string,pageno:string,media_type:string): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(appConfig.apiUrl + '/search_filter/'+localStorage.getItem('user_id')+'/'+camera_name+'/'+time+'/'+pageno+'/'+media_type, options)
            .map((response: Response) =>response.json())
            .catch(this.handleErrorObservable);
    }

    search_filter_total_count(camera_name:string,time:string,media_type:string): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(appConfig.apiUrl + '/search_filter_total_count/'+localStorage.getItem('user_id')+'/'+camera_name+'/'+time+'/'+media_type, options)
            .map((response: Response) =>response.json())
            .catch(this.handleErrorObservable);
    }
    
    private handleErrorObservable (error: Response | any) {
        console.error(error.message || error);
        return Observable.throw(error.message || error);
    }
    
}