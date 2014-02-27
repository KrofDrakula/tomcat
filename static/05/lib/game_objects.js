function GameObject(pos, graphic, props) {
    this.pos      = pos;
    this.graphic  = graphic;
    this.props    = props || {};
    this.width    = graphic.get(0).naturalWidth;
    this.height   = graphic.get(0).naturalHeight;
    this.render   = this.render.bind(this);
    this.rotation = 0;
}

EventEmitter.mixin(GameObject.prototype);

GameObject.prototype.render = function(camera, view) {
    var cPos = this.pos.clone().sub(camera.pos);
    if (cPos.z <= 0) {
        this.graphic.css({display: 'none'});
    } else {
        this.graphic.css({
            display         : 'block',
            transform       : this.getTransformString(camera, view),
            transformOrigin : '0 0',
            opacity         : Math.min(cPos.z / camera.f, 5/4-1/(4*camera.f)*cPos.z),
            zIndex          : Math.round(1e8 - cPos.z)
        });
    }
};

GameObject.prototype.getTransformString = function(camera, view) {
    var cPos = this.pos.clone().sub(camera.pos),
        k = camera.f / cPos.z,
        x = (cPos.x - this.width  / 2) * k + view.width  / 2,
        y = (cPos.y - this.height / 2) * k + view.height / 2;

    return 'translate3d(' + x + 'px, ' + y + 'px, 0) ' +
           'scale(' + k + ') ' +
           'translate3d(' + (this.width/2) + 'px, ' + (this.height/2) + 'px, 0) ' +
           'rotateZ(' + this.rotation + 'deg) ' +
           'translate3d(' + (-this.width/2) + 'px, ' + (-this.height/2) + 'px, 0)';
};

GameObject.prototype.getBoundingRect = function() {
    return this.graphic.get(0).getBoundingClientRect();
};