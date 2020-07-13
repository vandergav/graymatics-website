
export class Curve {
  _path = new Object();
  _current_path: number;
  _canvas :any = null;
  _follower: boolean = false;

  setCurrentPath(cp:any) {
    this._current_path = cp;
  }

  currentPath() {
    return this._current_path;
  }

  append(point:any) {
    if (!(this._current_path in this._path)) {
      this._path[this._current_path] = new Array();
    }
    this._path[this._current_path].push(point);
  }

  path() {
    return this._path;
  }

  setCanvas(canvas:any) {
    this._canvas = canvas;
  }

  getCanvas() {
    return this._canvas;
  }

  setFollower(follower:any) {
    this._follower = follower;
  }

  follower() {
    return this._follower;
  }
}
