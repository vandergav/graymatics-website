
var mainHelper = require("../helpers/MainHelper");

exports.table = {
    camera: function(camera_id) {
      this.counter = 1;
      this.total = 0;
      this.thresh_hold = 2;
      this.scene_id = mainHelper.randomToken();
      this._id = camera_id;
    }
}