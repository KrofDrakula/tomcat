function GameObject(pos, graphic, props) {
    this.pos      = pos;
    this.graphic  = graphic;
    this.props    = props || {};
    this.width    = graphic.naturalWidth;
    this.height   = graphic.naturalHeight;
    this.render   = this.render.bind(this);
    this.rotation = 0;
}

EventEmitter.mixin(GameObject.prototype);

GameObject.prototype.render = function(camera, view) {
    var z = this.pos.z - camera.pos.z;
    if (z <= 0) {
        this.graphic.style.display = 'none';
    } else {
        var style = this.graphic.style;
        style.display               = 'block';
        style.webkitTransform       = this.getTransformMatrix(camera, view);
        style.webkitTransformOrigin = '0 0',
        style.opacity               = Math.min(z / camera.f, 5/4-1/(4*camera.f)*z);
        style.zIndex                = Math.round(1e8 - z);
    }
};

GameObject.prototype.getTransformString = function(camera, view) {
    var k = camera.f / (this.pos.z - camera.pos.z),
        x = (this.pos.x - camera.pos.x - this.width  / 2) * k + view.width  / 2,
        y = (this.pos.y - camera.pos.y - this.height / 2) * k + view.height / 2,
        r = this.rotation / 180 * Math.PI;

    return 'translate3d(' + x + 'px, ' + y + 'px, 0) ' +
           'scale(' + k + ') ' +
           'translate3d(' + (this.width/2) + 'px, ' + (this.height/2) + 'px, 0) ' +
           'rotateZ(' + this.rotation + 'deg) ' +
           'translate3d(' + (-this.width/2) + 'px, ' + (-this.height/2) + 'px, 0)';
};


(function() {

    var m = new WebKitCSSMatrix,
        reset = 'matrix3d(1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1)';

    GameObject.prototype.getTransformMatrix = function(camera, view) {
        var k = camera.f / (this.pos.z - camera.pos.z),
            x = (this.pos.x - camera.pos.x - this.width  / 2) * k + view.width  / 2,
            y = (this.pos.y - camera.pos.y - this.height / 2) * k + view.height / 2,
            r = this.rotation / 180 * Math.PI;

        m.setMatrixValue(reset);

        m = m.translate(x, y, 0);
        m = m.rotate(r);
        m = m.scale(k);
        m.m43 = 0.00001;

        return m;
    };

})();

GameObject.prototype.getBoundingRect = function() {
    return this.graphic.getBoundingClientRect();
};