var Avatar = function(head, body) {
    var self = this;
    this.setPart('head', head);
    this.setPart('body', body);

    this.baseReady = function() {
	    self.onReady = self.baseReady;
    };
    this.onReady = this.baseReady;
};

Avatar.prototype.ready = function(callback) {
    if (this.headReady && this.bodyReady) {
	this.onReady();
	if (callback)
	    callback();
    } else if (callback) {
	    var oldReady = this.onReady;
	    this.onReady = function() {
	        oldReady();
	        callback();
	    };
    }
}

Avatar.prototype.setPart = function(type, info) {
    var self = this;
    this[type] = info;
    this[type + 'Ready'] = false;
    var image = new Image();
    image.onload = function() {
	    self[type + 'Ready'] = true;
	    self.ready();
    };
    this[type + 'Image'] = image;
    image.src = info['src'];
}

Avatar.prototype.display = function(ctx, x, y, headdx, headdy, headLeft, bodyLeft, scale) {
    if (!scale)
	    scale = 100;

    var headWidth = scale;
    if (this.head.width)
	    headWidth *= this.headImage.width / this.head.width;
    var bodyHeight = .667 * scale;
    if (this.body.height)
	    bodyHeight *= this.bodyImage.height / this.body.height;

    var headScale = headWidth / this.headImage.width;
    var headHeight = this.headImage.height * headScale;

    var bodyScale = bodyHeight / this.bodyImage.height;
    var bodyWidth = this.bodyImage.width * bodyScale;

    ctx.save()
    if (bodyLeft) {
	    ctx.scale(-1, 1);
	    ctx.drawImage(this.bodyImage, -(x + this.body.anchor * bodyScale), y - (this.body.topoff || 0), bodyWidth, bodyHeight);
    } else
	    ctx.drawImage(this.bodyImage, x - this.body.anchor * bodyScale, y - (this.body.topoff || 0), bodyWidth, bodyHeight);
    ctx.restore();

    if (this.head.height)
	    headdy += (this.headImage.height - this.head.height) * headScale;

    ctx.save();
    if (headLeft) {
	    ctx.scale(-1, 1);
	    ctx.drawImage(this.headImage, -(x + this.head.anchor * headScale + headdx), y - headHeight + headdy, headWidth, headHeight);
    } else
	    ctx.drawImage(this.headImage, x - this.head.anchor * headScale + headdx, y - headHeight + headdy, headWidth, headHeight);
    ctx.restore();
}

var Agent = function(avatar, x, y) {
    this.avatar = avatar;
    this.locx = x;
    this.locy = y
    this.headdx = 0;
    this.headdy = 0;
    this.headLeft = false;
    this.bodyLeft = false;
    this.movingHead = false;

    this.destinations = [];
}

Agent.prototype.move = function() {
    if (this.destinations.length > 0) {
	unitvec = getUnitVector(this.locx, this.locy, this.destinations[0].xx, this.destinations[0].yy);
	this.bodyLeft = unitvec.uuunit < 0;

	this.locx += unitvec.uuunit;
	this.locy += unitvec.vvunit;

	if (unitvec.distance < 2)
	    this.destinations.shift();
    } else
	this.randomMove();
}

Agent.prototype.randomMove = function() {
    if (Math.random() < .01)
	    this.movingHead = !this.movingHead;

    if (this.movingHead) {
	    this.headdx = this.headdx * .9 + Math.random() * 2 - 1;
	    this.headdy = this.headdy * .7 + Math.random();
	    if (Math.random() < .005)
	        this.headLeft = !this.headLeft;
    } else {
        var dx = Math.random() * 2 - 1;
        var dy = Math.random() * 2 - 1;
        if (permitSlide(this.locx, this.locy + 60, this.locx + dx, this.locy + dy + 60)) {
        //if (false) {
	        this.locx += dx;
	        this.locy += dy;
        }
	    if (Math.random() < .005)
	        this.bodyLeft = !this.bodyLeft;
    }
}

Agent.prototype.slideTo = function(x, y) {
    if (permitSlide(this.locx, this.locy + 60, x, y))
	    this.destinations = [{xx: x, yy: y - 60}];
    else
	    this.movingHead = !this.movingHead;
}

Agent.prototype.display = function(ctx) {
    this.avatar.display(ctx, this.locx, this.locy, this.headdx, this.headdy, this.headLeft, this.bodyLeft);
}
