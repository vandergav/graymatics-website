import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Face } from '../_models/index';
import { appConfig } from '../app.config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class FaceService {
    constructor(private http: Http) { }
    
    file_upload(file: FormData): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(appConfig.apiUrl + '/upload', 
                 file)
                .map((response: Response) => response.json())
                .catch(this.handleErrorObservable);
    }

    add(face: Face): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(appConfig.apiUrl + '/face_recognition', 
                JSON.stringify(face), options)
                .map((response: Response) => response.json())
                .catch(this.handleErrorObservable);
    }

    face_tarining(face: Face): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(appConfig.apiUrl + '/face_video_training', 
                JSON.stringify(face), options)
                .map((response: Response) => response.json())
                .catch(this.handleErrorObservable);
    }

    update(face: Face): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put(appConfig.apiUrl + '/face_recognition', 
                JSON.stringify(face), options)
                .map((response: Response) => response.json())
                .catch(this.handleErrorObservable);
    }

    list_face(user_id: string): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(appConfig.apiUrl + '/face_list/'+user_id, 
                 options)
                .map((response: Response) => response.json())
                .catch(this.handleErrorObservable);
    }

    list_face_recognition(user_id: string): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(appConfig.apiUrl + '/face_recognition_list/'+user_id, 
                 options)
                .map((response: Response) => response.json())
                .catch(this.handleErrorObservable);
    }

    get(user_id:string,face_id: string): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(appConfig.apiUrl + '/face_recognition/'+user_id+'/'+face_id, 
                 options)
                .map((response: Response) => response.json())
                .catch(this.handleErrorObservable);
    }

    remove(face_id: string): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.delete(appConfig.apiUrl + '/face_recognition/'+face_id, 
                 options)
                .map((response: Response) => response.json())
                .catch(this.handleErrorObservable);
    }

    reset(camera_id: number): Observable<string> {
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