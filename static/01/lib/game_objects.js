function GameObject(pos, graphic, props) {
    this.pos     = pos;
    this.graphic = graphic;
    this.props   = props || {};
    this.width   = graphic.get(0).naturalWidth;
    this.height  = graphic.get(0).naturalHeight;
    this.render  = this.render.bind(this);
}

GameObject.prototype.render = function(camera, view) {
    var cPos = this.pos.sub(camera.pos);
    if (cPos.z <= 0) {
        this.graphic.css({display: 'none'});
    } else {
        var k = camera.f / cPos.z;
        this.graphic.css({
            display : 'block',
            left    : Math.round((cPos.x - this.width  / 2) * k + view.width  / 2) + 'px',
            top     : Math.round((cPos.y - this.height / 2) * k + view.height / 2) + 'px',
            width   : Math.round(this.width  * k) + 'px',
            height  : Math.round(this.height * k) + 'px',
            opacity : Math.min(cPos.z / camera.f, 5/4-1/(4*camera.f)*cPos.z),
            zIndex  : Math.round(1e8 - cPos.z)
        });
    }
};