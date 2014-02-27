function Vec2(x, y) {
    this.x = x;
    this.y = y;
}

Object.defineProperty(Vec2.prototype, 'length', {
    get        : function() { return Math.sqrt(this.x * this.x + this.y * this.y); },
    enumerable : true
});

Vec2.prototype.add = function(x, y) {
    if (x instanceof Vec2)            return new Vec2(this.x + x.x, this.y + x.y);
    else if (typeof y == 'undefined') return new Vec2(this.x + x,   this.y + x);
    else                              return new Vec2(this.x + x,   this.y + y);
};

Vec2.prototype.neg = function() {
    return new Vec2(-this.x, -this.y);
};

Vec2.prototype.sub = function(x, y) {
    if (x instanceof Vec2)            return new Vec2(this.x - x.x, this.y - x.y);
    else if (typeof y == 'undefined') return new Vec2(this.x - x,   this.y - x);
    else                              return new Vec2(this.x - x,   this.y - y);
};

Vec2.prototype.scale = function(a, b) {
    if (a instanceof Vec2)       return new Vec2(this.x * a.x, this.y * a.y);
    if (typeof b == 'undefined') return new Vec2(this.x * a,   this.y * a);
    else                         return new Vec2(this.x * a,   this.y * b);
};

Vec2.prototype.dot = function(x, y) {
    if (x instanceof Vec2) return this.x * x.x + this.y * x.y;
    else                   return this.x * x   + this.y * y;
};






function Vec3(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

Object.defineProperty(Vec3.prototype, 'length', {
    get        : function() { return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z); },
    enumerable : true
});

Vec3.prototype.add = function(x, y, z) {
    if (x instanceof Vec3)            return new Vec3(this.x + x.x, this.y + x.y, this.z + x.z);
    else if (typeof y == 'undefined') return new Vec3(this.x + x,   this.y + x,   this.z + x);
    else                              return new Vec3(this.x + x,   this.y + y,   this.z + z);
};

Vec3.prototype.neg = function() {
    return new Vec3(-this.x, -this.y, -this.z);
};

Vec3.prototype.sub = function(x, y, z) {
    if (x instanceof Vec3)            return new Vec3(this.x - x.x, this.y - x.y, this.z - x.z);
    else if (typeof y == 'undefined') return new Vec3(this.x - x,   this.y - x,   this.z - x);
    else                              return new Vec3(this.x - x,   this.y - y,   this.z - z);
};

Vec3.prototype.scale = function(a, b, c) {
    if (a instanceof Vec3)            return new Vec3(this.x * a.x, this.y * a.y, this.z * a.z);
    else if (typeof b == 'undefined') return new Vec3(this.x * a,   this.y * a,   this.z * a);
    else                              return new Vec3(this.x * a,   this.y * b,   this.z * c);
};

Vec3.prototype.dot = function(x, y, z) {
    if (x instanceof Vec3) return this.x * x.x + this.y * x.y + this.z * x.z;
    else                   return this.x * x   + this.y * y   + this.z * z;
};

Vec3.prototype.cross = function(x, y, z) {
    if (x instanceof Vec3) return new Vec3(this.y * x.z - this.z * x.y, this.z * x.x - this.x * x.z, this.x * x.y - this.y * x.x);
    else                   return new Vec3(this.y * z   - this.z * y,   this.z * x   - this.x * z,   this.x * y   - this.y * x);
};