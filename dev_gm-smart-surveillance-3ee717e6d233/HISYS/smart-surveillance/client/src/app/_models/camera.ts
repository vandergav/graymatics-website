export class Camera {
    camera_id: number;
    user_id: string;
    name: string;
    type:string;
    source: string;
    fps:string;
    gps: string;
    status:string;
    agent:string;
    vehicleTracking: boolean;
    peopleTracking: boolean;
    algo: Array<String>;
}