import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigNotification, ConfigUserList } from '../_models/index';
import { appConfig } from '../app.config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ConfigurationService {

    constructor(private http: Http) { }

    get(scene_id:String,media_type:string): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(appConfig.apiUrl + '/notification/'+scene_id+'/'+media_type, options)
            .map((response: Response) =>response.json())
            .catch(this.handleErrorObservable);
    }

    add(configNotification: ConfigNotification): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(appConfig.apiUrl + '/configuration/notification', 
                JSON.stringify(configNotification), options)
                .map((response: Response) => response.json())
                .catch(this.handleErrorObservable);
    }

    listEvents(): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(appConfig.apiUrl + '/configuration/notification/'+localStorage.getItem('user_id'), options)
            .map((response: Response) =>response.json())
            .catch(this.handleErrorObservable);
    }

    update(configNotification: ConfigNotification): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put(appConfig.apiUrl + '/configuration/notification', 
                JSON.stringify(configNotification), options)
                .map((response: Response) => response.json())
                .catch(this.handleErrorObservable);
    }
    
    count(type:string,media:string): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(appConfig.apiUrl + '/basic_notification/count/'+localStorage.getItem('user_id')+'/'+type+'/'+media, options)
            .map((response: Response) =>response.json())
            .catch(this.handleErrorObservable);
    }

    remove(_id: string): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.delete(appConfig.apiUrl + '/configuration/notification/'+_id, 
                 options)
                .map((response: Response) => response.json())
                .catch(this.handleErrorObservable);
    }

    add_user_list(configUserList: ConfigUserList): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(appConfig.apiUrl + '/configuration/user_list', 
                JSON.stringify(configUserList), options)
                .map((response: Response) => response.json())
                .catch(this.handleErrorObservable);
    }
    
    listUsers(): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(appConfig.apiUrl + '/configuration/user_list', options)
            .map((response: Response) =>response.json())
            .catch(this.handleErrorObservable);
    }

    private handleErrorObservable (error: Response | any) {
        console.error(error.message || error);
        return Observable.throw(error.message || error);
    }
    
}