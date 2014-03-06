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

GameObject.prototype.render = function(camera, view, ctx) {
    var z = this.pos.z - camera.pos.z,
        k = camera.f / z,
        x = (this.pos.x - camera.pos.x) * k + view.width / 2,
        y = (this.pos.y - camera.pos.y) * k + view.height / 2,
        w = this.width * k,
        h = this.height * k;

    if (z > 0) {
        ctx.save();
        ctx.globalAlpha = Math.min(z / camera.f, 5/4-1/(4*camera.f)*z);

        ctx.translate(x, y);
        ctx.rotate(-this.rotation);
        ctx.drawImage(this.graphic, -w/2, -h/2, w, h);

        ctx.restore();
        ctx.globalAlpha = 1;
    }
};