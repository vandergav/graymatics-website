import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Vehicle } from '../_models/index';
import { appConfig } from '../app.config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class VehicleService {
    constructor(private http: Http) { }
    
    add(vehicle: Vehicle): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(appConfig.apiUrl + '/vehicle_recognition', 
                JSON.stringify(vehicle), options)
                .map((response: Response) => response.json())
                .catch(this.handleErrorObservable);
    }

    update(vehicle: Vehicle): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put(appConfig.apiUrl + '/vehicle_recognition', 
                JSON.stringify(vehicle), options)
                .map((response: Response) => response.json())
                .catch(this.handleErrorObservable);
    }

    list_vehicle(user_id: string): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(appConfig.apiUrl + '/vehicle_list/'+user_id, 
                 options)
                .map((response: Response) => response.json())
                .catch(this.handleErrorObservable);
    }

    list_vehicle_recognition(user_id: string): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(appConfig.apiUrl + '/vehicle_recognition_list/'+user_id, 
                 options)
                .map((response: Response) => response.json())
                .catch(this.handleErrorObservable);
    }

    get_list_name(user_id:string,list_name: string): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(appConfig.apiUrl + '/vehicle_recognition/list_name/'+user_id+'/'+list_name, 
                 options)
                .map((response: Response) => response.json())
                .catch(this.handleErrorObservable);
    }

    remove(_id: string): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.delete(appConfig.apiUrl + '/vehicle_recognition/'+_id, 
                 options)
                .map((response: Response) => response.json())
                .catch(this.handleErrorObservable);
    }
    
    private handleErrorObservable (error: Response | any) {
        //console.error(error.message || error);
        return Observable.throw(error.message || error);
    }

}